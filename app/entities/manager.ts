interface Manager {
  id: number;
  gymId: number;
  gymName: string;
  authId: number;
  createdByAuthId: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  avatarUrl: string;
  createdAt: string;
}

interface ManagerForm {
  id?: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  avatarURL: string;
}

const initialManagerForm: ManagerForm = {
  id: undefined,
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  phone: "",
  avatarURL: "",
};

export type { Manager, ManagerForm };
export { initialManagerForm };
