const mapperManagerShiftItem = (
	raw: Record<string, unknown>,
): ManagerShiftItem => ({
	shiftId: getNumber(raw.shift_id),
	gymId: getNumber(raw.gym_id),
	gymName: getString(raw.gym_name),
	managerAuthId: getNumber(raw.manager_auth_id),
	managerName: getString(raw.manager_name),
	managerEmail: getString(raw.manager_email),
	openTime: getString(raw.open_time),
	closeTime: raw.close_time ? getString(raw.close_time) : null,
	openCash: getNumber(raw.open_cash),
	closeCash: getNumber(raw.close_cash),
	totalCollected: getNumber(raw.total_collected),
	difference: getNumber(raw.difference),
	status: getString(raw.status),
});

const mapperPaginationManagerShifts = (
	raw: unknown,
): PaginationManagerShifts => {
	if (!isRecord(raw)) {
		return {
			shifts: [],
			paginate: mapperPagination({}),
		};
	}

	const rawData = Array.isArray(raw.data) ? raw.data : [];
	const rawPaginate = isRecord(raw.paginate) ? raw.paginate : {};

	return {
		shifts: rawData.filter(isRecord).map(mapperManagerShiftItem),
		paginate: mapperPagination(rawPaginate),
	};
};

const mapperHourlyDistribution = (
	raw: Record<string, unknown>,
): HourlyDistributionItem => ({
	hour: getNumber(raw.hour),
	count: getNumber(raw.count),
});

const mapperGymAttendanceReport = (raw: unknown): GymAttendanceReport => {
	if (!isRecord(raw)) {
		return {
			gymId: 0,
			gymName: "",
			totalCheckIns: 0,
			peakHour: 0,
			peakHourCount: 0,
			membershipsCount: 0,
			dayPassesCount: 0,
			guestsCount: 0,
			hourlyDistribution: [],
		};
	}

	const rawHourly = Array.isArray(raw.hourly_distribution)
		? raw.hourly_distribution
		: [];

	return {
		gymId: getNumber(raw.gym_id),
		gymName: getString(raw.gym_name),
		totalCheckIns: getNumber(raw.total_check_ins),
		peakHour: getNumber(raw.peak_hour),
		peakHourCount: getNumber(raw.peak_hour_count),
		membershipsCount: getNumber(raw.memberships_count),
		dayPassesCount: getNumber(raw.day_passes_count),
		guestsCount: getNumber(raw.guests_count),
		hourlyDistribution: rawHourly
			.filter(isRecord)
			.map(mapperHourlyDistribution),
	};
};

const mapperRevenueByPaymentMethod = (
	raw: Record<string, unknown>,
): RevenueByPaymentMethod => ({
	paymentMethodId: getNumber(raw.payment_method_id),
	paymentMethodName: getString(raw.payment_method_name),
	totalRevenue: getNumber(raw.total_revenue),
	transactionCount: getNumber(raw.transaction_count),
});

const mapperRevenueByPlan = (raw: Record<string, unknown>): RevenueByPlan => ({
	planId: getNumber(raw.plan_id),
	planName: getString(raw.plan_name),
	totalRevenue: getNumber(raw.total_revenue),
	subscriptionCount: getNumber(raw.subscription_count),
});

const mapperCrossRevenueReport = (raw: unknown): CrossRevenueReport => {
	if (!isRecord(raw)) {
		return {
			gymId: 0,
			gymName: "",
			totalRevenue: 0,
			byPaymentMethod: [],
			byPlan: [],
		};
	}

	const rawMethods = Array.isArray(raw.by_payment_method)
		? raw.by_payment_method
		: [];
	const rawPlans = Array.isArray(raw.by_plan) ? raw.by_plan : [];

	return {
		gymId: getNumber(raw.gym_id),
		gymName: getString(raw.gym_name),
		totalRevenue: getNumber(raw.total_revenue),
		byPaymentMethod: rawMethods
			.filter(isRecord)
			.map(mapperRevenueByPaymentMethod),
		byPlan: rawPlans.filter(isRecord).map(mapperRevenueByPlan),
	};
};

const mapperClient360Report = (raw: unknown): Client360Report => {
	if (!isRecord(raw)) {
		return {
			userId: 0,
			fullName: "",
			email: "",
			phone: "",
			totalSpent: 0,
			totalCheckIns: 0,
			subscriptions: [],
			payments: [],
			recentCheckIns: [],
		};
	}

	const rawSubs = Array.isArray(raw.subscriptions) ? raw.subscriptions : [];
	const rawPayments = Array.isArray(raw.payments) ? raw.payments : [];
	const rawCheckIns = Array.isArray(raw.recent_check_ins)
		? raw.recent_check_ins
		: [];

	return {
		userId: getNumber(raw.user_id),
		fullName: getString(raw.full_name),
		email: getString(raw.email),
		phone: getString(raw.phone),
		totalSpent: getNumber(raw.total_spent),
		totalCheckIns: getNumber(raw.total_check_ins),
		subscriptions: rawSubs.filter(isRecord).map((s) => ({
			id: getNumber(s.id),
			planName: getString(s.plan_name),
			status: getString(s.status),
			startDate: getString(s.start_date),
			endDate: getString(s.end_date),
		})),
		payments: rawPayments.filter(isRecord).map((p) => ({
			id: getNumber(p.id),
			amount: getNumber(p.amount),
			method: getString(p.method),
			status: getString(p.status),
			date: getString(p.date),
		})),
		recentCheckIns: rawCheckIns.filter(isRecord).map((c) => ({
			id: getNumber(c.id),
			accessType: getString(c.access_type),
			date: getString(c.date),
		})),
	};
};

const mapperDashboardSummaryReport = (raw: unknown): DashboardSummaryReport => {
	if (!isRecord(raw)) {
		return {
			gymId: 0,
			gymName: "",
			kpis: {
				totalRevenue: 0,
				totalTransactions: 0,
				activeSubscribers: 0,
				totalCheckIns: 0,
				peakHour: 0,
				peakHourCount: 0,
			},
			recentPayments: [],
			recentShifts: [],
		};
	}

	const rawKpis = isRecord(raw.kpis) ? raw.kpis : {};
	const rawPayments = Array.isArray(raw.recent_payments)
		? raw.recent_payments
		: [];
	const rawShifts = Array.isArray(raw.recent_shifts) ? raw.recent_shifts : [];

	return {
		gymId: getNumber(raw.gym_id),
		gymName: getString(raw.gym_name),
		kpis: {
			totalRevenue: getNumber(rawKpis.total_revenue),
			totalTransactions: getNumber(rawKpis.total_transactions),
			activeSubscribers: getNumber(rawKpis.active_subscribers),
			totalCheckIns: getNumber(rawKpis.total_check_ins),
			peakHour: getNumber(rawKpis.peak_hour),
			peakHourCount: getNumber(rawKpis.peak_hour_count),
		},
		recentPayments: rawPayments.filter(isRecord).map((p) => ({
			id: getNumber(p.id),
			amount: getNumber(p.amount),
			paymentMethodName: getString(p.payment_method_name),
			paymentStatusName: getString(p.payment_status_name),
			paymentDate: getString(p.payment_date),
		})),
		recentShifts: rawShifts.filter(isRecord).map((s) => ({
			shiftId: getNumber(s.shift_id),
			managerName: getString(s.manager_name),
			openTime: getString(s.open_time),
			closeTime: s.close_time ? getString(s.close_time) : null,
			openCash: getNumber(s.open_cash),
			status: getString(s.status),
		})),
	};
};

export {
	mapperClient360Report,
	mapperCrossRevenueReport,
	mapperDashboardSummaryReport,
	mapperGymAttendanceReport,
	mapperManagerShiftItem,
	mapperPaginationManagerShifts,
};
