interface ValidateAccessPayload {
	gym_id: number;
	slug?: string;
	email?: string;
}

interface AccessResult {
	allowed: boolean;
	message: string;
	accessType: string;
	fullName: string;
	planName: string;
	checkedInAt: string;
}

interface CheckInRecord {
	id: number;
	gymId: number;
	gymName: string;
	accessTypeId: number;
	accessTypeName: string;
	userId: number | null;
	userFullName: string;
	dayPassId: number | null;
	subscriptionId: number | null;
	registeredById: number | null;
	registeredByName: string;
	checkedInAt: string;
}

interface PaginationCheckIn {
	page: number;
	pageSize: number;
	total: number;
	totalPages: number;
	from?: string;
	to?: string;
}

const initialPaginationCheckIn: PaginationCheckIn = {
	page: 1,
	pageSize: 10,
	total: 0,
	totalPages: 1,
	from: undefined,
	to: undefined,
};

export type {
	AccessResult,
	CheckInRecord,
	PaginationCheckIn,
	ValidateAccessPayload,
};
export { initialPaginationCheckIn };
