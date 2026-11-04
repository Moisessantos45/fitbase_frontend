const mapperStateGeneric = (data: Record<string, unknown>): StatusGeneric => {
  return {
    id: getNumber(data.id, 1),
    name: getString(data.name, ""),
    createdAt: getDateToString(data.created_at),
    updatedAt: getDateToString(data.updated_at),
  };
};

export { mapperStateGeneric };
