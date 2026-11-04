import axios, {
  type InternalAxiosRequestConfig,
  type AxiosRequestConfig,
  type AxiosResponse,
  type AxiosError,
} from "axios";

const getBaseUrl = (): string => {
  const nuxtApp = tryUseNuxtApp();
  if (nuxtApp) {
    return (
      (nuxtApp.$config?.public?.apiBase as string) ||
      "http://localhost:4107/api/v1"
    );
  }
  return (
    (import.meta.env.NUXT_PUBLIC_API_BASE as string) ||
    "http://localhost:4107/api/v1"
  );
};

const apiAuth = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

const apiPublic = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

const pendingRequests = new Map<string, string>();

function requestFingerprint(config: AxiosRequestConfig): string {
  const url = config.url ?? "";
  const method = (config.method ?? "").toUpperCase();
  const body =
    typeof config.data === "string"
      ? config.data
      : JSON.stringify(config.data ?? "");
  return `${method}:${url}:${body}`;
}

function attachIdempotencyKey(
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig {
  const method = (config.method ?? "").toUpperCase();
  if (method !== "POST" && method !== "PUT" && method !== "PATCH")
    return config;

  config.headers = config.headers ?? {};
  if (config.headers["X-Idempotency-Key"]) return config;

  const fp = requestFingerprint(config);
  const existing = pendingRequests.get(fp);
  if (existing) {
    config.headers["X-Idempotency-Key"] = existing;
  } else {
    const newKey = crypto.randomUUID();
    pendingRequests.set(fp, newKey);
    config.headers["X-Idempotency-Key"] = newKey;
  }
  return config;
}

function cleanupIdempotencyKey(config: AxiosRequestConfig): void {
  pendingRequests.delete(requestFingerprint(config));
}

const shouldSkipAuthHeader = (url?: string): boolean => {
  if (!url) return false;
  return ["/auth/login", "/auth/2fa/verify", "/auth/refresh-token"].some(
    (path) => url.includes(path),
  );
};

const shouldSkipRefreshRetry = (url?: string): boolean => {
  if (!url) return false;
  return [
    "/auth/refresh-token",
    "/auth/login",
    "/auth/2fa/verify",
    "/auth/logout",
  ].some((path) => url.includes(path));
};

let isRefreshing = false;
let failedQueue: {
  resolve: (value: string) => void;
  reject: (reason?: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null = null): void => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const retriedRequests = new Set<string>();

function markRetried(config: AxiosRequestConfig): void {
  retriedRequests.add(requestFingerprint(config));
}

function wasRetried(config: AxiosRequestConfig): boolean {
  return retriedRequests.has(requestFingerprint(config));
}

function clearRetried(config: AxiosRequestConfig): void {
  retriedRequests.delete(requestFingerprint(config));
}

apiPublic.interceptors.request.use((config) => {
  config.baseURL = getBaseUrl();
  return attachIdempotencyKey(config);
});

apiPublic.interceptors.response.use(
  (response: AxiosResponse) => {
    cleanupIdempotencyKey(response.config);
    return response;
  },
  (error: AxiosError) => {
    if (error.config) cleanupIdempotencyKey(error.config);
    return Promise.reject(error);
  },
);

apiAuth.interceptors.request.use((config) => {
  config.baseURL = getBaseUrl();
  const token = useAuthStore().getToken();
  if (
    token &&
    !config.headers.Authorization &&
    !shouldSkipAuthHeader(config.url)
  ) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  return attachIdempotencyKey(config);
});

apiAuth.interceptors.response.use(
  (response: AxiosResponse) => {
    cleanupIdempotencyKey(response.config);
    clearRetried(response.config);
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;

    if (!originalRequest) return Promise.reject(error);

    cleanupIdempotencyKey(originalRequest);

    if (
      error.response?.status === 401 &&
      !wasRetried(originalRequest) &&
      !shouldSkipRefreshRetry(originalRequest.url)
    ) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiAuth(originalRequest);
        });
      }

      markRetried(originalRequest);
      isRefreshing = true;

      try {
        const newToken = await useAuthStore().getRefreshToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        processQueue(null, newToken);
        return apiAuth(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        useAuthStore().clearAuthData();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    clearRetried(originalRequest);
    return Promise.reject(error);
  },
);

export { apiAuth, apiPublic };
