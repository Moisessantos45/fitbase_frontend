const mapperPaymentItem = (raw: Record<string, unknown>): PaymentRecord => ({
	id: getNumber(raw.id),
	gymId: getNumber(raw.gym_id),
	gymName: getString(raw.gym_name),
	paymentMethodId: getNumber(raw.payment_method_id, 1),
	paymentMethodName: getString(raw.payment_method_name),
	paymentStatusId: getNumber(raw.payment_status_id),
	paymentStatusName: getString(raw.payment_status_name),
	amount: getNumber(raw.amount),
	subscriptionId: getOptionalNumber(raw.subscription_id) ?? null,
	dayPassId: getOptionalNumber(raw.day_pass_id) ?? null,
	cashRegisterId: getOptionalNumber(raw.cash_register_id) ?? null,
	paymentDate: getString(raw.payment_date),
	createdAt: getString(raw.created_at),
});

const mapperPaginationPayment = (raw: unknown): PaginationPayment => {
	if (!isRecord(raw)) {
		return {
			payments: [],
			paginate: mapperPagination({}),
		};
	}

	const rawData = Array.isArray(raw.data) ? raw.data : [];
	const rawPaginate = isRecord(raw.paginate) ? raw.paginate : {};

	return {
		payments: rawData.filter(isRecord).map(mapperPaymentItem),
		paginate: mapperPagination(rawPaginate),
	};
};

const mapperGymRevenueSummary = (raw: unknown): GymRevenueSummary => {
	if (!isRecord(raw)) {
		return {
			gymId: 0,
			gymName: "",
			totalRevenue: 0,
			totalTransactions: 0,
		};
	}

	return {
		gymId: getNumber(raw.gym_id),
		gymName: getString(raw.gym_name),
		totalRevenue: getNumber(raw.total_revenue),
		totalTransactions: getNumber(raw.total_transactions),
	};
};

const mapperStripeCheckoutResponse = (raw: unknown): StripeCheckoutResponse => {
	if (!isRecord(raw)) {
		return {
			sessionId: "",
			checkoutUrl: "",
			paymentId: 0,
			amount: 0,
		};
	}

	return {
		sessionId: getString(raw.session_id),
		checkoutUrl: getString(raw.checkout_url),
		paymentId: getNumber(raw.payment_id),
		amount: getNumber(raw.amount),
	};
};

const mapperStripeSessionStatusResponse = (
	raw: unknown,
): StripeSessionStatusResponse => {
	if (!isRecord(raw)) {
		return {
			sessionId: "",
			paymentStatus: "",
			status: "",
			paymentId: 0,
			amountTotal: 0,
			currency: "",
		};
	}

	return {
		sessionId: getString(raw.session_id),
		paymentStatus: getString(raw.payment_status),
		status: getString(raw.status),
		paymentId: getNumber(raw.payment_id),
		amountTotal: getNumber(raw.amount_total),
		currency: getString(raw.currency),
	};
};

export {
	mapperGymRevenueSummary,
	mapperPaginationPayment,
	mapperPaymentItem,
	mapperStripeCheckoutResponse,
	mapperStripeSessionStatusResponse,
};
