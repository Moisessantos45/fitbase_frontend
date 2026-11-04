export const useSubscriptionStore = defineStore("subscription", () => {
	const { exec, loading } = useApiResult();

	const subscriptions = ref<SubscriptionItem[]>([]);
	const mySubscriptions = ref<SubscriptionItem[]>([]);
	const pagination = reactive<PaginationSubscription>(
		structuredClone(initialPaginationSubscription),
	);
	const myPagination = reactive<PaginationSubscription>(
		structuredClone(initialPaginationSubscription),
	);

	const getSubscriptionsByGym = async (
		gymId: number,
		statusId?: number,
		page?: number,
	) => {
		if (page !== undefined) pagination.page = page;
		if (statusId !== undefined) pagination.statusId = statusId;

		const params: Record<string, unknown> = {
			page: pagination.page,
			page_size: pagination.pageSize,
		};
		if (pagination.statusId) {
			params.status_id = pagination.statusId;
		}

		return await exec(
			() => apiAuth.get(`/gyms/${gymId}/subscriptions`, { params }),
			{
				mapper(res) {
					const payload = res.data?.data;
					const rawList = Array.isArray(payload)
						? payload
						: Array.isArray(payload?.data)
							? payload.data
							: [];
					const paginateSource = payload?.paginate ?? res.data?.paginate;
					return {
						data: rawList.filter(isRecord).map(mapperSubscription),
						pagination: mapperPaginationSubscription(paginateSource),
					};
				},
				onSuccess: (resData) => {
					subscriptions.value = resData.data;
					pagination.total = resData.pagination.total;
					pagination.totalPages = resData.pagination.totalPages;
				},
				onError: (_) => {},
			},
		);
	};

	const getMySubscriptions = async (page = 1, pageSize = 10) => {
		myPagination.page = page;
		myPagination.pageSize = pageSize;

		return await exec(
			() =>
				apiAuth.get("/subscriptions/my-subscriptions", {
					params: { page, page_size: pageSize },
				}),
			{
				mapper(res) {
					const payload = res.data?.data;
					const rawList = Array.isArray(payload)
						? payload
						: Array.isArray(payload?.data)
							? payload.data
							: [];
					const paginateSource = payload?.paginate ?? res.data?.paginate;
					return {
						data: rawList.filter(isRecord).map(mapperSubscription),
						pagination: mapperPaginationSubscription(paginateSource),
					};
				},
				onSuccess: (resData) => {
					mySubscriptions.value = resData.data;
					myPagination.total = resData.pagination.total;
					myPagination.totalPages = resData.pagination.totalPages;
				},
				onError: (_) => {},
			},
		);
	};

	const cancelSubscription = async (id: number) => {
		return await exec(() => apiAuth.put(`/subscriptions/${id}/cancel`), {
			mapper(res) {
				return {
					message: res.data?.message ?? "Suscripción cancelada exitosamente",
					data: res.data?.data,
				};
			},
			onSuccess: () => {
				const targetSub = mySubscriptions.value.find((s) => s.id === id);
				if (targetSub) {
					targetSub.statusId = 2;
					targetSub.statusName = "Inactivo";
					targetSub.autoRenew = false;
				}
				const gymSub = subscriptions.value.find((s) => s.id === id);
				if (gymSub) {
					gymSub.statusId = 2;
					gymSub.statusName = "Inactivo";
					gymSub.autoRenew = false;
				}
			},
			onError: (_) => {},
		});
	};

	return {
		subscriptions,
		mySubscriptions,
		pagination,
		myPagination,
		loading,
		getSubscriptionsByGym,
		getMySubscriptions,
		cancelSubscription,
	};
});
