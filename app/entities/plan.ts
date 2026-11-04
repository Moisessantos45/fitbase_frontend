interface PlanItem {
	id?: number;
	planId?: number;
	name: string;
	description: string;
}

interface Plan {
	id?: number;
	gymId: number;
	gymName?: string;
	name: string;
	description: string;
	price: number;
	discount: number;
	finalPrice: number;
	duration: number;
	planType: string;
	maxVisits?: number | null;
	active: boolean;
	items?: PlanItem[];
	createdAt?: string;
	updatedAt?: string;
}

interface PlanForm {
	id?: number;
	gymId: number;
	name: string;
	description: string;
	price: number;
	discount: number;
	duration: number;
	planType: string;
	maxVisits: number | null;
	active?: boolean;
	items: PlanItem[];
}

interface PlanUpdatePayload {
	name?: string;
	description?: string;
	price?: number;
	discount?: number;
	duration?: number;
	planType?: string;
	maxVisits?: number | null;
	active?: boolean;
}

const initialPlanItem: PlanItem = {
	name: "",
	description: "",
};

const initialPlan: Plan = {
	id: undefined,
	gymId: 0,
	gymName: "",
	name: "",
	description: "",
	price: 0,
	discount: 0,
	finalPrice: 0,
	duration: 30,
	planType: "Mensual",
	maxVisits: null,
	active: true,
	items: [],
	createdAt: "",
	updatedAt: "",
};

const initialPlanForm: PlanForm = {
	id: undefined,
	gymId: 0,
	name: "",
	description: "",
	price: 0,
	discount: 0,
	duration: 30,
	planType: "Mensual",
	maxVisits: null,
	active: true,
	items: [],
};

interface EnrollmentActiveSubscription {
	id: number;
	slug: string;
	planId: number;
	planName: string;
	startDate: string;
	endDate: string;
	remainingDays?: number;
	statusName: string;
	autoRenew: boolean;
}

interface EnrollmentPlan extends Plan {
	isCurrent: boolean;
}

interface EnrollmentResponse {
	gymId: number;
	gymName: string;
	hasActiveSubscription: boolean;
	activeSubscription: EnrollmentActiveSubscription | null;
	plans: EnrollmentPlan[];
}

export type {
	EnrollmentActiveSubscription,
	EnrollmentPlan,
	EnrollmentResponse,
	Plan,
	PlanForm,
	PlanItem,
	PlanUpdatePayload,
};
export { initialPlan, initialPlanForm, initialPlanItem };
