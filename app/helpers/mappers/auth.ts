const authMapper = (data: Record<string, unknown>): Auth => {
  return {
    roleId: getNumber(data.role_id),
    id: getNumber(data.id),
    email: getString(data.email),
    twoFactorEnabled: getBoolean(data.two_factor_enabled),
    firstSession: getBoolean(data.first_session),
    fullProfile: getBoolean(data.full_profile),
    emailConfirmed: getBoolean(data.email_confirmed),
    token: getString(data.token),
  };
};

const authToJson = (auth: Partial<Auth>) => ({
  id: auth.id,
  email: auth.email,
  two_factor_enabled: auth.twoFactorEnabled,
  first_session: auth.firstSession,
  full_profile: auth.fullProfile,
  email_confirmed: auth.emailConfirmed,
  token: auth.token,
});

export { authMapper, authToJson };
