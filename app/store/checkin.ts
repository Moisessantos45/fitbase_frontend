export const useCheckInStore = defineStore("checkin", () => {
	const { exec, loading } = useApiResult();

	const checkIns = ref<CheckInRecord[]>([]);
	const myHistory = ref<CheckInRecord[]>([]);
	const lastResult = ref<AccessResult | null>(null);
	const lastError = ref<string | null>(null);
	const pagination = reactive<PaginationCheckIn>(
		structuredClone(initialPaginationCheckIn),
	);
	const myPagination = reactive<PaginationCheckIn>(
		structuredClone(initialPaginationCheckIn),
	);

	const scanAccess = async (payload: ValidateAccessPayload) => {
		lastError.value = null;
		return await exec(() => apiAuth.post("/checkin/scan", payload), {
			mapper(res) {
				const raw = res.data?.data;
				return mapperAccessResult(raw);
			},
			onSuccess: (data) => {
				lastResult.value = data;
			},
			onError: (err) => {
				lastResult.value = null;
				lastError.value = err.msg || "Acceso denegado";
			},
		});
	};

	const getCheckInsByGym = async (
		gymId: number,
		page?: number,
		pageSize?: number,
		from?: string,
		to?: string,
	) => {
		if (page !== undefined) pagination.page = page;
		if (pageSize !== undefined) pagination.pageSize = pageSize;
		if (from !== undefined) pagination.from = from;
		if (to !== undefined) pagination.to = to;

		const params: Record<string, unknown> = {
			page: pagination.page,
			page_size: pagination.pageSize,
		};
		if (pagination.from) params.from = pagination.from;
		if (pagination.to) params.to = pagination.to;

		return await exec(
			() => apiAuth.get(`/gyms/${gymId}/checkins`, { params }),
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
						data: rawList.filter(isRecord).map(mapperCheckInRecord),
						pagination: mapperPaginationCheckIn(paginateSource),
					};
				},
				onSuccess: (resData) => {
					checkIns.value = resData.data;
					pagination.total = resData.pagination.total;
					pagination.totalPages = resData.pagination.totalPages;
				},
				onError: (_) => {},
			},
		);
	};

	const getMyHistory = async (page = 1, pageSize = 10) => {
		myPagination.page = page;
		myPagination.pageSize = pageSize;

		return await exec(
			() =>
				apiAuth.get("/checkin/my-history", {
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
						data: rawList.filter(isRecord).map(mapperCheckInRecord),
						pagination: mapperPaginationCheckIn(paginateSource),
					};
				},
				onSuccess: (resData) => {
					myHistory.value = resData.data;
					myPagination.total = resData.pagination.total;
					myPagination.totalPages = resData.pagination.totalPages;
				},
				onError: (_) => {},
			},
		);
	};

	const clearLastResult = () => {
		lastResult.value = null;
		lastError.value = null;
	};

	return {
		checkIns,
		myHistory,
		lastResult,
		lastError,
		pagination,
		myPagination,
		loading,
		scanAccess,
		getCheckInsByGym,
		getMyHistory,
		clearLastResult,
	};
});
