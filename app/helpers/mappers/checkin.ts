const mapperAccessResult = (raw: unknown): AccessResult => {
	if (!isRecord(raw)) {
		return {
			allowed: false,
			message: "Error al validar acceso",
			accessType: "",
			fullName: "",
			planName: "",
			checkedInAt: "",
		};
	}
	return {
		allowed: getBoolean(raw.allowed),
		message: getString(raw.message),
		accessType: getString(raw.access_type),
		fullName: getString(raw.full_name),
		planName: getString(raw.plan_name),
		checkedInAt: getDateToString(raw.checked_in_at),
	};
};

const mapperCheckInRecord = (raw: Record<string, unknown>): CheckInRecord => ({
	id: getNumber(raw.id),
	gymId: getNumber(raw.gym_id),
	gymName: getString(raw.gym_name),
	accessTypeId: getNumber(raw.access_type_id),
	accessTypeName: getString(raw.access_type_name),
	userId: getOptionalNumber(raw.user_id) ?? null,
	userFullName: getString(raw.user_full_name),
	dayPassId: getOptionalNumber(raw.day_pass_id) ?? null,
	subscriptionId: getOptionalNumber(raw.subscription_id) ?? null,
	registeredById: getOptionalNumber(raw.registered_by_id) ?? null,
	registeredByName: getString(raw.registered_by_name),
	checkedInAt: getDateToString(raw.checked_in_at),
});

const mapperPaginationCheckIn = (raw: unknown): PaginationCheckIn => {
	if (!isRecord(raw)) {
		return structuredClone(initialPaginationCheckIn);
	}
	return {
		page: getNumber(raw.page, 1),
		pageSize: getNumber(raw.page_size, 10),
		total: getNumber(raw.total, 0),
		totalPages: getNumber(raw.total_pages, 1),
		from: raw.from ? getString(raw.from) : undefined,
		to: raw.to ? getString(raw.to) : undefined,
	};
};

export { mapperAccessResult, mapperCheckInRecord, mapperPaginationCheckIn };
