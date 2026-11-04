export interface ManagerShiftItem {
	shiftId: number;
	gymId: number;
	gymName: string;
	managerAuthId: number;
	managerName: string;
	managerEmail: string;
	openTime: string;
	closeTime: string | null;
	openCash: number;
	closeCash: number;
	totalCollected: number;
	difference: number;
	status: string;
}

export interface PaginationManagerShifts {
	shifts: ManagerShiftItem[];
	paginate: Pagination;
}

export interface HourlyDistributionItem {
	hour: number;
	count: number;
}

export interface GymAttendanceReport {
	gymId: number;
	gymName: string;
	totalCheckIns: number;
	peakHour: number;
	peakHourCount: number;
	membershipsCount: number;
	dayPassesCount: number;
	guestsCount: number;
	hourlyDistribution: HourlyDistributionItem[];
}

export interface RevenueByPaymentMethod {
	paymentMethodId: number;
	paymentMethodName: string;
	totalRevenue: number;
	transactionCount: number;
}

export interface RevenueByPlan {
	planId: number;
	planName: string;
	totalRevenue: number;
	subscriptionCount: number;
}

export interface CrossRevenueReport {
	gymId: number;
	gymName: string;
	totalRevenue: number;
	byPaymentMethod: RevenueByPaymentMethod[];
	byPlan: RevenueByPlan[];
}

export interface Client360Subscription {
	id: number;
	planName: string;
	status: string;
	startDate: string;
	endDate: string;
}

export interface Client360Payment {
	id: number;
	amount: number;
	method: string;
	status: string;
	date: string;
}

export interface Client360CheckIn {
	id: number;
	accessType: string;
	date: string;
}

export interface Client360Report {
	userId: number;
	fullName: string;
	email: string;
	phone: string;
	totalSpent: number;
	totalCheckIns: number;
	subscriptions: Client360Subscription[];
	payments: Client360Payment[];
	recentCheckIns: Client360CheckIn[];
}

export interface DashboardSummaryKPIs {
	totalRevenue: number;
	totalTransactions: number;
	activeSubscribers: number;
	totalCheckIns: number;
	peakHour: number;
	peakHourCount: number;
}

export interface DashboardRecentPayment {
	id: number;
	amount: number;
	paymentMethodName: string;
	paymentStatusName: string;
	paymentDate: string;
}

export interface DashboardRecentShift {
	shiftId: number;
	managerName: string;
	openTime: string;
	closeTime: string | null;
	openCash: number;
	status: string;
}

export interface DashboardSummaryReport {
	gymId: number;
	gymName: string;
	kpis: DashboardSummaryKPIs;
	recentPayments: DashboardRecentPayment[];
	recentShifts: DashboardRecentShift[];
}
