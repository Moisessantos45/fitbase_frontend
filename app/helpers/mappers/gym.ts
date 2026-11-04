const minutesToTimeString = (minutes: number): string => {
  const safeMinutes = Math.max(0, Math.min(1440, minutes));
  const hours = Math.floor(safeMinutes / 60)
    .toString()
    .padStart(2, "0");
  const mins = (safeMinutes % 60).toString().padStart(2, "0");
  return `${hours}:${mins}`;
};

const timeStringToMinutes = (timeStr: string): number => {
  if (!timeStr?.includes(":")) return 0;
  const [hours, minutes] = timeStr.split(":").map((val) => Number(val) || 0);
  return (hours || 0) * 60 + (minutes || 0);
};

const convertDataToMinutes = (value: unknown): number => {
  const num = getNumber(value);

  return minutesToTimeString(num) === "00:00" ? 0 : num;
};

const mapperGymSchedule = (data: Record<string, unknown>): GymScheduleItem => {
  return {
    id: getNumber(data.id),
    gymId: getNumber(data.gym_id),
    dayOfWeek: getNumber(data.day_of_week),
    openMinutes: convertDataToMinutes(data.open_minutes),
    closeMinutes: convertDataToMinutes(data.close_minutes),
    isClosed: !getBoolean(data.is_closed),
  };
};

const mapperGymPhoto = (data: Record<string, unknown>): GymPhoto => {
  return {
    id: getNumber(data.id),
    fileId: getNumber(data.file_id),
    slug: getString(data.slug),
    url: getString(data.url),
    mimeType: getString(data.mime_type),
    size: getNumber(data.size),
    createdAt: getDateToString(data.created_at),
  };
};

const mapperGym = (data: Record<string, unknown>): Gym => {
  const rawSchedules = data.schedules ?? data.gym_schedules;
  const rawPhotos = data.photos;

  return {
    id: getNumber(data.id),
    ownerId: getNumber(data.owner_id),
    backgroundId:
      data.background_id !== null && data.background_id !== undefined
        ? getNumber(data.background_id)
        : null,
    backgroundUrl: getString(data.background_url),
    name: getString(data.name),
    address: getString(data.address),
    phone: getString(data.phone),
    email: getString(data.email),
    latitude: getNumber(data.latitude),
    longitude: getNumber(data.longitude),
    isOpen: getBoolean(data.is_open),
    distanceMeters: getOptionalNumber(data.distance_meters),
    coordsStr: `${getNumber(data.latitude)}, ${getNumber(data.longitude)}`,
    createdAt: getDateToString(data.created_at),
    updatedAt: getDateToString(data.updated_at),
    schedules: Array.isArray(rawSchedules)
      ? rawSchedules.filter(isRecord).map(mapperGymSchedule)
      : [],
    photos: Array.isArray(rawPhotos)
      ? rawPhotos.filter(isRecord).map(mapperGymPhoto)
      : [],
  };
};

const mapperGymDetail = (data: Record<string, unknown>): GymDetail => {
  const rawSchedules = data.schedules ?? data.gym_schedules;
  const rawPhotos = data.photos;

  return {
    id: getNumber(data.id),
    name: getString(data.name),
    address: getString(data.address),
    phone: getString(data.phone),
    email: getString(data.email),
    backgroundUrl: getString(data.background_url),
    latitude: getNumber(data.latitude),
    longitude: getNumber(data.longitude),
    isOpen: getBoolean(data.is_open),
    distanceMeters: getOptionalNumber(data.distance_meters),
    schedules: Array.isArray(rawSchedules)
      ? rawSchedules.filter(isRecord).map(mapperGymSchedule)
      : [],
    photos: Array.isArray(rawPhotos)
      ? rawPhotos.filter(isRecord).map(mapperGymPhoto)
      : [],
  };
};

const gymToJson = (gym: Partial<Gym>): Record<string, unknown> => ({
  name: gym.name,
  address: gym.address,
  phone: gym.phone,
  email: gym.email,
  latitude: gym.latitude,
  longitude: gym.longitude,
});

const scheduleToJson = (
  schedule: Partial<GymScheduleItem>,
): Record<string, unknown> => {
  const result: Record<string, unknown> = {
    open_minutes: schedule.openMinutes,
    close_minutes: schedule.closeMinutes,
    is_closed: schedule.isClosed,
  };
  if (schedule.dayOfWeek !== undefined) {
    result.day_of_week = schedule.dayOfWeek;
  }
  return result;
};

const schedulesListToJson = (
  schedules: GymScheduleItem[],
): Record<string, unknown>[] =>
  schedules.map((item) => ({
    day_of_week: item.dayOfWeek,
    open_minutes: item.openMinutes,
    close_minutes: item.closeMinutes,
    is_closed: item.isClosed,
  }));

export {
  gymToJson,
  mapperGym,
  mapperGymDetail,
  mapperGymPhoto,
  mapperGymSchedule,
  minutesToTimeString,
  schedulesListToJson,
  scheduleToJson,
  timeStringToMinutes,
};
