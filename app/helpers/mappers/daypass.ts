const mapperDayPassTicket = (raw: unknown): DayPassTicket | null => {
	if (!isRecord(raw)) return null;
	return {
		id: getNumber(raw.id),
		slug: getString(raw.slug),
		gymId: getNumber(raw.gym_id),
		gymName: getString(raw.gym_name),
		planId: getNumber(raw.plan_id),
		planName: getString(raw.plan_name),
		planPrice: getNumber(raw.plan_price),
		isPaid: getBoolean(raw.is_paid),
		fullName: getString(raw.full_name),
		phone: getString(raw.phone),
		email: getString(raw.email),
		visitDate: getString(raw.visit_date),
		isUsed: getBoolean(raw.is_used),
		createdAt: getDateToString(raw.created_at),
	};
};

const mapperDayPassDetail = (raw: unknown): DayPassDetail | null => {
	if (!isRecord(raw)) return null;
	const ticket = mapperDayPassTicket(raw);
	if (!ticket) return null;
	return {
		...ticket,
		userId: getOptionalNumber(raw.user_id) ?? null,
	};
};

const mapperPaginatedDayPasses = (raw: unknown): PaginatedDayPasses => {
	if (!isRecord(raw)) {
		return {
			data: [],
			paginate: mapperPagination({}),
		};
	}
	const list = Array.isArray(raw.data)
		? raw.data
				.filter(isRecord)
				.map(mapperDayPassDetail)
				.filter((d): d is DayPassDetail => d !== null)
		: [];
	const rawPaginate = isRecord(raw.paginate) ? raw.paginate : {};
	return {
		data: list,
		paginate: mapperPagination(rawPaginate),
	};
};

export { mapperDayPassDetail, mapperDayPassTicket, mapperPaginatedDayPasses };
