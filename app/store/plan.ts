export const usePlanStore = defineStore("plan", () => {
	const { exec, loading } = useApiResult();

	const plans = ref<Plan[]>([]);
	const adminPlans = ref<Plan[]>([]);
	const enrollmentData = ref<EnrollmentResponse | null>(null);
	const enrollmentPlans = computed<EnrollmentPlan[]>(
		() => enrollmentData.value?.plans ?? [],
	);
	const planDetail = ref<Plan | null>(null);
	const planForm = reactive<PlanForm>(structuredClone(initialPlanForm));
	const itemForm = reactive<PlanItem>(structuredClone(initialPlanItem));

	const resetPlanForm = (gymId?: number) => {
		Object.assign(planForm, structuredClone(initialPlanForm));
		if (gymId) planForm.gymId = gymId;
		planForm.items = [{ name: "", description: "" }];
	};

	const resetItemForm = () => {
		Object.assign(itemForm, structuredClone(initialPlanItem));
	};

	const getPlansByGym = async (gymId: number) => {
		return await exec(() => apiPublic.get(`/gyms/${gymId}/plans`), {
			mapper(res) {
				const raw = res.data.data;
				const list = Array.isArray(raw) ? raw : [];
				return list.filter(isRecord).map(mapperPlan);
			},
			onSuccess: (data) => {
				plans.value = data;
			},
			onError: (_) => {},
		});
	};

	const getPlanDetail = async (planId: number) => {
		return await exec(() => apiPublic.get(`/plans/${planId}`), {
			mapper(res) {
				const raw = res.data.data;
				if (!isRecord(raw)) {
					throw new Error("No se encontraron datos para el plan solicitado.");
				}
				return mapperPlan(raw);
			},
			onSuccess: (data) => {
				planDetail.value = data;
				Object.assign(planForm, mapperPlanToForm(data));
			},
			onError: (_) => {},
		});
	};

	const getAllPlansByGym = async (gymId: number) => {
		return await exec(() => apiAuth.get(`/gyms/${gymId}/all-plans`), {
			mapper(res) {
				const raw = res.data.data;
				const list = Array.isArray(raw) ? raw : [];
				return list.filter(isRecord).map(mapperPlan);
			},
			onSuccess: (data) => {
				adminPlans.value = data;
			},
			onError: (_) => {},
		});
	};

	const getEnrollmentPlans = async (gymId: number) => {
		return await exec(() => apiAuth.get(`/gyms/${gymId}/plans/enrollment`), {
			mapper(res) {
				const raw = res.data.data;
				return mapperEnrollmentResponse(raw);
			},
			onSuccess: (data) => {
				enrollmentData.value = data;
				plans.value = data.plans;
			},
			onError: (_) => {},
		});
	};

	const createPlan = async (payload?: PlanForm) => {
		const body = payload ? planToJson(payload) : planToJson(planForm);
		return await exec(() => apiAuth.post("/plans", body), {
			mapper(res) {
				const raw = res.data.data;
				if (!isRecord(raw)) {
					throw new Error("Error al crear el plan. Intenta nuevamente.");
				}
				return mapperPlan(raw);
			},
			onSuccess: (data) => {
				plans.value.push(data);
				adminPlans.value.push(data);
			},
			onError: (_) => {},
		});
	};

	const updatePlan = async (
		planId: number,
		payload?: PlanUpdatePayload | PlanForm,
	) => {
		const body = payload
			? planUpdateToJson(payload)
			: planUpdateToJson(planForm);
		return await exec(() => apiAuth.put(`/plans/${planId}`, body), {
			mapper(res) {
				return res.data.message ?? "Plan actualizado exitosamente";
			},
			onSuccess: async () => {
				await getPlanDetail(planId);
			},
			onError: (_) => {},
		});
	};

	const addItem = async (
		planId: number,
		payload?: { name: string; description: string },
	) => {
		const body = payload ? planItemToJson(payload) : planItemToJson(itemForm);
		return await exec(() => apiAuth.post(`/plans/${planId}/items`, body), {
			mapper(res) {
				return res.data.message ?? "Beneficio agregado exitosamente";
			},
			onSuccess: async () => {
				await getPlanDetail(planId);
				resetItemForm();
			},
			onError: (_) => {},
		});
	};

	const updateItem = async (
		planId: number,
		itemId: number,
		payload: { name?: string; description?: string },
	) => {
		return await exec(
			() =>
				apiAuth.put(
					`/plans/${planId}/items/${itemId}`,
					planItemToJson(payload),
				),
			{
				mapper(res) {
					return res.data.message ?? "Beneficio actualizado exitosamente";
				},
				onSuccess: async () => {
					await getPlanDetail(planId);
				},
				onError: (_) => {},
			},
		);
	};

	const deleteItem = async (planId: number, itemId: number) => {
		return await exec(
			() => apiAuth.delete(`/plans/${planId}/items/${itemId}`),
			{
				mapper(res) {
					return res.data.message ?? "Beneficio eliminado exitosamente";
				},
				onSuccess: async () => {
					await getPlanDetail(planId);
				},
				onError: (_) => {},
			},
		);
	};

	const clearPlanDetail = () => {
		planDetail.value = null;
	};

	return {
		plans,
		adminPlans,
		enrollmentData,
		enrollmentPlans,
		planDetail,
		planForm,
		itemForm,
		loading,
		resetPlanForm,
		resetItemForm,
		getPlansByGym,
		getPlanDetail,
		getAllPlansByGym,
		getEnrollmentPlans,
		createPlan,
		updatePlan,
		addItem,
		updateItem,
		deleteItem,
		clearPlanDetail,
	};
});
