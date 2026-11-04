const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const getString = (value: unknown, fallback: string = ""): string =>
  typeof value === "string" ? value : fallback;

const getNumber = (value: unknown, fallback: number = 0): number => {
  const num = Number(value);
  return Number.isNaN(num) ? fallback : num;
};

const formatDate = (value: unknown): string => {
  if (typeof value !== "string") return "";
  const date = new Date(value);
  return date.toISOString().split("T")[0] ?? "";
};

const getDateToString = (value: unknown): string => {
  const str = getString(value);
  if (!str) return "";

  const date = new Date(str);
  if (Number.isNaN(date.getTime())) return "";

  return date.toISOString().split("T")[0] ?? "";
};

function getTimeToString(value: unknown): string {
  const raw = getString(value);
  if (!raw) return "";
  const match = raw.match(/(\d{2}:\d{2}):\d{2}/);
  return match?.[1] ?? "";
}

const getBoolean = (value: unknown): boolean =>
  typeof value === "boolean"
    ? value
    : value === "true" || value === 1 || value === "1";

const getStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
};

const getOptionalNumber = (value: unknown): number | undefined =>
  typeof value === "number" && !Number.isNaN(value) ? value : undefined;

const getDateToHour = (
  value: unknown,
  timeZone = "America/Mexico_City",
): string => {
  const timestamp = getString(value);
  if (!timestamp) return "";

  const fecha = new Date(timestamp);
  if (Number.isNaN(fecha.getTime())) return "";

  const fmt = new Intl.DateTimeFormat("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone,
  });

  const parts = fmt.formatToParts(fecha);
  const hourPart = parts.find((p) => p.type === "hour")?.value ?? "00";
  const minutePart = parts.find((p) => p.type === "minute")?.value ?? "00";
  const secondPart = parts.find((p) => p.type === "second")?.value ?? "00";

  const hh = hourPart.padStart(2, "0");
  const mm = minutePart.padStart(2, "0");
  const ss = secondPart.padStart(2, "0");

  return `${hh}:${mm}:${ss}`;
};

const formatSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const toMinutes = (value: number | string): number => {
  return typeof value === "string" ? timeStringToMinutes(value) : value;
};

const toTimeString = (value: number | string): string => {
  return typeof value === "number" ? minutesToTimeString(value) : value;
};

const formatDistance = (meters?: number) => {
  if (meters === undefined || meters === null || meters <= 0) return "";
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
};

const formatMinutes = (minutes: number) => {
  const safe = Math.max(0, Math.min(1440, minutes));
  const h = Math.floor(safe / 60)
    .toString()
    .padStart(2, "0");
  const m = (safe % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
};

const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
};

export {
  isRecord,
  getString,
  getNumber,
  formatDate,
  getDateToString,
  getTimeToString,
  getBoolean,
  getStringArray,
  getOptionalNumber,
  getDateToHour,
  formatSize,
  toMinutes,
  toTimeString,
  formatDistance,
  formatMinutes,
  calculateDistance,
};
