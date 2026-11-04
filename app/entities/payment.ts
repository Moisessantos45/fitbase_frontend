export interface PaymentRecord {
	id: number;
	gymId: number;
	gymName: string;
	paymentMethodId: number;
	paymentMethodName: string;
	paymentStatusId: number;
	paymentStatusName: string;
	amount: number;
	subscriptionId?: number | null;
	dayPassId?: number | null;
	cashRegisterId?: number | null;
	paymentDate: string;
	createdAt: string;
}

export interface PaginationPayment {
	payments: PaymentRecord[];
	paginate: Pagination;
}

export interface GymRevenueSummary {
	gymId: number;
	gymName: string;
	totalRevenue: number;
	totalTransactions: number;
}

export interface CashPaymentPayload {
	gym_id: number;
	payment_method_id: number;
	amount: number;
	subscription_id?: number | null;
	day_pass_id?: number | null;
}

export interface StripeCheckoutPayload {
	gym_id: number;
	plan_id: number;
	type: "subscription" | "daypass";
	auto_renew: boolean;
	visit_date?: string;
}

export interface GuestCheckoutPayload {
	gym_id: number;
	plan_id: number;
	full_name: string;
	phone: string;
	email: string;
	visit_date?: string;
}

export interface StripeCheckoutResponse {
	sessionId: string;
	checkoutUrl: string;
	paymentId: number;
	amount: number;
}

export interface StripeSessionStatusResponse {
	sessionId: string;
	paymentStatus: string;
	status: string;
	paymentId: number;
	amountTotal: number;
	currency: string;
}
