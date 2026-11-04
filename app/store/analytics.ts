export const useAnalyticsStore = defineStore("analytics", () => {
	const { exec, loading } = useApiResult();

	const shifts = ref<ManagerShiftItem[]>([]);
	const shiftsTotal = ref(0);
	const shiftsTotalPages = ref(1);
	const shiftsCurrentPage = ref(1);

	const attendance = ref<GymAttendanceReport | null>(null);
	const crossRevenue = ref<CrossRevenueReport | null>(null);
	const client360 = ref<Client360Report | null>(null);
	const dashboardSummary = ref<DashboardSummaryReport | null>(null);

	const getDashboardSummary = async (gymId: number) => {
		return await exec(
			() => apiAuth.get(`/gyms/${gymId}/analytics/dashboard-summary`),
			{
				mapper(res) {
					const mapped = mapperDashboardSummaryReport(res.data.data);
					dashboardSummary.value = mapped;
					return mapped;
				},
			},
		);
	};

	const getShiftsReport = async (
		gymId: number,
		page = 1,
		pageSize = 10,
		from?: string,
		to?: string,
	) => {
		return await exec(
			() =>
				apiAuth.get(`/gyms/${gymId}/analytics/shifts`, {
					params: { page, page_size: pageSize, from, to },
				}),
			{
				mapper(res) {
					const mapped = mapperPaginationManagerShifts(res.data.data);
					shifts.value = mapped.shifts;
					shiftsTotal.value = mapped.paginate.total;
					shiftsTotalPages.value = mapped.paginate.totalPages;
					shiftsCurrentPage.value = mapped.paginate.page;
					return mapped;
				},
			},
		);
	};

	const getAttendanceReport = async (
		gymId: number,
		from?: string,
		to?: string,
	) => {
		return await exec(
			() =>
				apiAuth.get(`/gyms/${gymId}/analytics/attendance`, {
					params: { from, to },
				}),
			{
				mapper(res) {
					const mapped = mapperGymAttendanceReport(res.data.data);
					attendance.value = mapped;
					return mapped;
				},
			},
		);
	};

	const getCrossRevenueReport = async (
		gymId: number,
		from?: string,
		to?: string,
	) => {
		return await exec(
			() =>
				apiAuth.get(`/gyms/${gymId}/analytics/revenue`, {
					params: { from, to },
				}),
			{
				mapper(res) {
					const mapped = mapperCrossRevenueReport(res.data.data);
					crossRevenue.value = mapped;
					return mapped;
				},
			},
		);
	};

	const getClient360Report = async (gymId: number, userId: number) => {
		return await exec(
			() => apiAuth.get(`/gyms/${gymId}/analytics/clients/${userId}`),
			{
				mapper(res) {
					const mapped = mapperClient360Report(res.data.data);
					client360.value = mapped;
					return mapped;
				},
			},
		);
	};

	return {
		shifts,
		shiftsTotal,
		shiftsTotalPages,
		shiftsCurrentPage,
		attendance,
		crossRevenue,
		client360,
		dashboardSummary,
		loading,
		getDashboardSummary,
		getShiftsReport,
		getAttendanceReport,
		getCrossRevenueReport,
		getClient360Report,
	};
});
