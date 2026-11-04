const mapperSubscription = (raw: Record<string, unknown>): SubscriptionItem => {
	return {
		id: getNumber(raw.id),
		slug: getString(raw.slug),
		userId: getNumber(raw.user_id),
		userFullName: getString(raw.user_full_name),
		userEmail: getString(raw.user_email),
		userPhone: getString(raw.user_phone),
		gymId: getNumber(raw.gym_id),
		gymName: getString(raw.gym_name),
		planId: getNumber(raw.plan_id),
		planName: getString(raw.plan_name),
		planPrice: getNumber(raw.plan_price),
		statusId: getNumber(raw.status_id),
		statusName: getString(raw.status_name),
		startDate: getDateToString(raw.start_date),
		endDate: getDateToString(raw.end_date),
		paymentMethodId: getOptionalNumber(raw.payment_method_id),
		paymentMethodName: raw.payment_method_name
			? getString(raw.payment_method_name)
			: undefined,
		autoRenew: getBoolean(raw.auto_renew),
		createdAt: getString(raw.created_at),
	};
};

const mapperPaginationSubscription = (raw: unknown): PaginationSubscription => {
	if (!isRecord(raw)) {
		return structuredClone(initialPaginationSubscription);
	}
	return {
		page: getNumber(raw.page, 1),
		pageSize: getNumber(raw.page_size, 10),
		total: getNumber(raw.total, 0),
		totalPages: getNumber(raw.total_pages, 1),
		search: "",
		statusId: undefined,
	};
};

export { mapperPaginationSubscription, mapperSubscription };
