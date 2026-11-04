const serializeToJson = <T>(value: unknown, fallback: T[]): T[] => {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? (parsed as T[]) : fallback;
    } catch {
      return fallback;
    }
  }

  return fallback;
};

const toSnakeCase = (str: string): string =>
  str
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/[-\s]+/g, "_")
    .toLowerCase();

const toCamelCase = (str: string): string =>
  str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

function isPlainObject(obj: unknown): obj is Record<PropertyKey, unknown> {
  return obj !== null && typeof obj === "object" && !Array.isArray(obj);
}

const keysToSnakeCase = (obj: unknown): unknown => {
  if (Array.isArray(obj)) {
    return obj.map(keysToSnakeCase);
  }

  if (isPlainObject(obj)) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        toSnakeCase(key as string),
        keysToSnakeCase(value),
      ]),
    );
  }

  return obj;
};

const serializeToJsonWithMapper = <T>(
  value: unknown,
  _: T[],
  mapper: (item: Record<string, unknown>) => T,
): T[] => {
  const array = serializeToJson<Record<string, unknown>>(value, []);
  return array.map(mapper);
};

export {
  keysToSnakeCase,
  serializeToJson,
  serializeToJsonWithMapper,
  toSnakeCase,
  toCamelCase,
};
