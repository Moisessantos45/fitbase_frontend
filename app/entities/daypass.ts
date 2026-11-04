export interface DayPassTicket {
	id: number;
	slug: string;
	gymId: number;
	gymName: string;
	planId: number;
	planName: string;
	planPrice: number;
	isPaid: boolean;
	fullName: string;
	phone: string;
	email: string;
	visitDate: string;
	isUsed: boolean;
	createdAt: string;
}

export interface DayPassDetail extends DayPassTicket {
	userId?: number | null;
}

export interface PaginatedDayPasses {
	data: DayPassDetail[];
	paginate: Pagination;
}

export interface TargetGym {
	id?: number;
	name: string;
	address?: string;
}

export interface CreateDayPassPayload {
	gym_id: number;
	plan_id: number;
	visit_date: string;
}

export interface RegisterGuestPayload {
	gym_id: number;
	plan_id: number;
	full_name: string;
	phone: string;
	email: string;
	visit_date?: string;
}
