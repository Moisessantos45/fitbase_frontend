const mapperPlanItem = (data: Record<string, unknown>): PlanItem => ({
	id: getNumber(data.id),
	planId: getOptionalNumber(data.plan_id),
	name: getString(data.name),
	description: getString(data.description),
});

const mapperPlan = (data: Record<string, unknown>): Plan => {
	const rawItems = data.items;
	const price = getNumber(data.price);
	const discount = getNumber(data.discount);
	const finalPrice =
		getOptionalNumber(data.final_price) ??
		(discount > 0 ? price * (1 - discount / 100) : price);

	return {
		id: getNumber(data.id),
		gymId: getNumber(data.gym_id),
		gymName: getString(data.gym_name),
		name: getString(data.name),
		description: getString(data.description),
		price,
		discount,
		finalPrice,
		duration: getNumber(data.duration),
		planType: getString(data.plan_type),
		maxVisits:
			data.max_visits !== null && data.max_visits !== undefined
				? getNumber(data.max_visits)
				: null,
		active: getBoolean(data.active),
		items: Array.isArray(rawItems)
			? rawItems.filter(isRecord).map(mapperPlanItem)
			: [],
		createdAt: getDateToString(data.created_at),
		updatedAt: getDateToString(data.updated_at),
	};
};

const clonePlanItems = (items?: PlanItem[]): PlanItem[] => {
	if (!items || !Array.isArray(items)) return [];
	return items.map((item) => ({
		id: item.id,
		planId: item.planId,
		name: item.name,
		description: item.description,
	}));
};

const mapperPlanToForm = (plan: Plan): PlanForm => ({
	id: plan.id,
	gymId: plan.gymId,
	name: plan.name,
	description: plan.description,
	price: plan.price,
	discount: plan.discount,
	duration: plan.duration,
	planType: plan.planType,
	maxVisits: plan.maxVisits ?? null,
	active: plan.active,
	items: clonePlanItems(plan.items),
});

const planToJson = (
	plan: Partial<PlanForm> | Partial<Plan>,
): Record<string, unknown> => {
	const result: Record<string, unknown> = {
		gym_id: plan.gymId,
		name: plan.name,
		description: plan.description,
		price: plan.price,
		discount: plan.discount,
		duration: plan.duration,
		plan_type: plan.planType,
		max_visits: plan.maxVisits ?? null,
	};

	if (plan.items && Array.isArray(plan.items)) {
		result.items = plan.items.map((item) => ({
			name: item.name,
			description: item.description,
		}));
	}

	return result;
};

const planUpdateToJson = (
	payload: PlanUpdatePayload | PlanForm,
): Record<string, unknown> => {
	const result: Record<string, unknown> = {};
	if (payload.name !== undefined) result.name = payload.name;
	if (payload.description !== undefined)
		result.description = payload.description;
	if (payload.planType !== undefined) result.plan_type = payload.planType;
	if (payload.price !== undefined) result.price = payload.price;
	if (payload.discount !== undefined) result.discount = payload.discount;
	if (payload.duration !== undefined) result.duration = payload.duration;
	if (payload.maxVisits !== undefined) result.max_visits = payload.maxVisits;
	if (payload.active !== undefined) result.active = payload.active;
	return result;
};

const planItemToJson = (item: Partial<PlanItem>): Record<string, unknown> => {
	const result: Record<string, unknown> = {
		name: item.name ?? "",
	};
	if (item.description !== undefined) {
		result.description = item.description;
	}
	return result;
};

const mapperEnrollmentActiveSubscription = (
	data: unknown,
): EnrollmentActiveSubscription | null => {
	if (!isRecord(data)) return null;
	return {
		id: getNumber(data.id),
		slug: getString(data.slug),
		planId: getNumber(data.plan_id),
		planName: getString(data.plan_name),
		startDate: getDateToString(data.start_date),
		endDate: getDateToString(data.end_date),
		remainingDays: getOptionalNumber(data.remaining_days),
		statusName: getString(data.status_name),
		autoRenew: getBoolean(data.auto_renew),
	};
};

const mapperEnrollmentPlan = (
	data: Record<string, unknown>,
): EnrollmentPlan => ({
	...mapperPlan(data),
	isCurrent: getBoolean(data.is_current),
});

const mapperEnrollmentResponse = (data: unknown): EnrollmentResponse => {
	if (!isRecord(data)) {
		return {
			gymId: 0,
			gymName: "",
			hasActiveSubscription: false,
			activeSubscription: null,
			plans: [],
		};
	}

	const rawPlans = Array.isArray(data.plans) ? data.plans : [];

	return {
		gymId: getNumber(data.gym_id),
		gymName: getString(data.gym_name),
		hasActiveSubscription: getBoolean(data.has_active_subscription),
		activeSubscription: mapperEnrollmentActiveSubscription(
			data.active_subscription,
		),
		plans: rawPlans.filter(isRecord).map(mapperEnrollmentPlan),
	};
};

export {
	clonePlanItems,
	mapperEnrollmentResponse,
	mapperPlan,
	mapperPlanItem,
	mapperPlanToForm,
	planItemToJson,
	planToJson,
	planUpdateToJson,
};
