interface SubscriptionItem {
	id: number;
	slug: string;
	userId: number;
	userFullName: string;
	userEmail: string;
	userPhone: string;
	gymId: number;
	gymName: string;
	planId: number;
	planName: string;
	planPrice: number;
	statusId: number;
	statusName: string;
	startDate: string;
	endDate: string;
	paymentMethodId?: number;
	paymentMethodName?: string;
	autoRenew: boolean;
	createdAt: string;
}

interface PaginationSubscription {
	page: number;
	pageSize: number;
	total: number;
	totalPages: number;
	statusId?: number;
	search: string;
}

const initialPaginationSubscription: PaginationSubscription = {
	page: 1,
	pageSize: 10,
	total: 0,
	totalPages: 1,
	statusId: undefined,
	search: "",
};

export type { PaginationSubscription, SubscriptionItem };
export { initialPaginationSubscription };
