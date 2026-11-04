interface GymScheduleItem {
  id?: number;
  gymId?: number;
  dayOfWeek: number;
  openMinutes: number;
  closeMinutes: number;
  isClosed: boolean;
}

interface GymPhoto {
  id: number;
  fileId: number;
  slug?: string;
  url: string;
  mimeType?: string;
  size?: number;
  createdAt?: string;
}

interface Gym {
  id?: number;
  ownerId?: number;
  backgroundId?: number | null;
  backgroundUrl?: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  latitude: number;
  longitude: number;
  isOpen?: boolean;
  createdAt?: string;
  updatedAt?: string;
  distanceMeters?: number;
  schedules?: GymScheduleItem[];
  photos?: GymPhoto[];
  coordsStr: string;
}

interface GymForm {
  name: string;
  address: string;
  phone: string;
  email: string;
  latitude: number;
  longitude: number;
}

interface GymDetail {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  backgroundUrl: string;
  latitude?: number;
  longitude?: number;
  isOpen: boolean;
  distanceMeters?: number;
  schedules: GymScheduleItem[];
  photos: GymPhoto[];
}

const initialGym: Gym = {
  id: undefined,
  ownerId: undefined,
  backgroundId: null,
  backgroundUrl: "",
  name: "",
  address: "",
  phone: "",
  email: "",
  latitude: 19.3734,
  longitude: -99.1798,
  isOpen: false,
  createdAt: "",
  updatedAt: "",
  schedules: [],
  photos: [],
  coordsStr: "19.3734, -99.1798",
};

const initialGymDetail: GymDetail = {
  id: 0,
  name: "",
  address: "",
  phone: "",
  email: "",
  backgroundUrl: "",
  isOpen: false,
  schedules: [],
  photos: [],
};

const initialGymForm: GymForm = {
  name: "",
  address: "",
  phone: "",
  email: "",
  latitude: 19.3734,
  longitude: -99.1798,
};

const initialSchedules: GymScheduleItem[] = [
  { dayOfWeek: 1, openMinutes: 360, closeMinutes: 1380, isClosed: false },
  { dayOfWeek: 2, openMinutes: 360, closeMinutes: 1380, isClosed: false },
  { dayOfWeek: 3, openMinutes: 360, closeMinutes: 1380, isClosed: false },
  { dayOfWeek: 4, openMinutes: 360, closeMinutes: 1380, isClosed: false },
  { dayOfWeek: 5, openMinutes: 360, closeMinutes: 1380, isClosed: false },
  { dayOfWeek: 6, openMinutes: 480, closeMinutes: 1260, isClosed: false },
  { dayOfWeek: 0, openMinutes: 0, closeMinutes: 0, isClosed: true },
];

export type { Gym, GymDetail, GymForm, GymPhoto, GymScheduleItem };
export { initialGym, initialGymDetail, initialGymForm, initialSchedules };
