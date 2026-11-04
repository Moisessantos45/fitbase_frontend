const mapperManager = (data: Record<string, unknown>): Manager => {
  return {
    id: getNumber(data.id),
    gymId: getNumber(data.gym_id),
    gymName: getString(data.gym_name),
    authId: getNumber(data.auth_id),
    createdByAuthId: getNumber(data.created_by_auth_id),
    firstName: getString(data.first_name),
    lastName: getString(data.last_name),
    phone: getString(data.phone),
    email: getString(data.email),
    avatarUrl: getString(data.avatar_url),
    createdAt: getDateToString(data.created_at),
  };
};

const managerToJson = (form: ManagerForm): Record<string, unknown> => ({
  email: form.email,
  password: form.password,
  first_name: form.firstName,
  last_name: form.lastName,
  phone: form.phone,
});

export { mapperManager, managerToJson };
