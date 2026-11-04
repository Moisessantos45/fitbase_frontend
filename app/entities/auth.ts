interface Role {
  id: number;
  name: string;
}

interface Auth {
  id: number;
  roleId: number;
  email: string;
  twoFactorEnabled: boolean;
  firstSession: boolean;
  fullProfile: boolean;
  emailConfirmed: boolean;
  token: string;
}

const initialAuthState: Auth = {
  id: 0,
  roleId: 0,
  email: "",
  twoFactorEnabled: false,
  firstSession: false,
  fullProfile: false,
  emailConfirmed: false,
  token: "",
};

export type { Auth, Role };
export { initialAuthState };
