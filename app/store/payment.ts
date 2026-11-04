export const usePaymentStore = defineStore("payment", () => {
	const { exec, loading } = useApiResult();

	const payments = ref<PaymentRecord[]>([]);
	const total = ref(0);
	const totalPages = ref(1);
	const currentPage = ref(1);
	const revenue = ref<GymRevenueSummary | null>(null);
	const checkoutSession = ref<StripeCheckoutResponse | null>(null);
	const sessionStatus = ref<StripeSessionStatusResponse | null>(null);

	const getPaymentsByGym = async (gymId: number, page = 1, pageSize = 10) => {
		return await exec(
			() =>
				apiAuth.get(`/gyms/${gymId}/payments`, {
					params: { page, page_size: pageSize },
				}),
			{
				mapper(res) {
					const mapped = mapperPaginationPayment(res.data.data);
					payments.value = mapped.payments;
					total.value = mapped.paginate.total;
					totalPages.value = mapped.paginate.totalPages;
					currentPage.value = mapped.paginate.page;
					return mapped;
				},
			},
		);
	};

	const getRevenueByGym = async (gymId: number) => {
		return await exec(() => apiAuth.get(`/gyms/${gymId}/payments/revenue`), {
			mapper(res) {
				const mapped = mapperGymRevenueSummary(res.data.data);
				revenue.value = mapped;
				return mapped;
			},
		});
	};

	const getMyPayments = async (page = 1, pageSize = 10) => {
		return await exec(
			() =>
				apiAuth.get("/payments/my-payments", {
					params: { page, page_size: pageSize },
				}),
			{
				mapper(res) {
					const mapped = mapperPaginationPayment(res.data.data);
					payments.value = mapped.payments;
					total.value = mapped.paginate.total;
					totalPages.value = mapped.paginate.totalPages;
					currentPage.value = mapped.paginate.page;
					return mapped;
				},
			},
		);
	};

	const registerCashPayment = async (payload: CashPaymentPayload) => {
		return await exec(() => apiAuth.post("/payments/cash", payload), {
			mapper(res) {
				return mapperPaymentItem(res.data.data);
			},
		});
	};

	const createStripeCheckoutSession = async (
		payload: StripeCheckoutPayload,
	) => {
		return await exec(
			() => apiAuth.post("/payments/stripe/checkout-session", payload),
			{
				mapper(res) {
					return mapperStripeCheckoutResponse(res.data.data);
				},
				onSuccess: (data) => {
					checkoutSession.value = data;
				},
				onError: (_) => {
					checkoutSession.value = null;
				},
			},
		);
	};

	const createGuestCheckoutSession = async (payload: GuestCheckoutPayload) => {
		return await exec(
			() => apiPublic.post("/payments/stripe/guest-checkout", payload),
			{
				mapper(res) {
					return mapperStripeCheckoutResponse(res.data.data);
				},
				onSuccess: (data) => {
					checkoutSession.value = data;
				},
				onError: (_) => {
					checkoutSession.value = null;
				},
			},
		);
	};

	const getStripeSessionStatus = async (sessionId: string) => {
		return await exec(
			() => apiPublic.get(`/payments/stripe/session/${sessionId}`),
			{
				mapper(res) {
					return mapperStripeSessionStatusResponse(res.data.data);
				},
				onSuccess: (data) => {
					sessionStatus.value = data;
				},
				onError: (_) => {
					sessionStatus.value = null;
				},
			},
		);
	};

	return {
		payments,
		total,
		totalPages,
		currentPage,
		revenue,
		checkoutSession,
		sessionStatus,
		loading,
		getPaymentsByGym,
		getRevenueByGym,
		getMyPayments,
		registerCashPayment,
		createStripeCheckoutSession,
		createGuestCheckoutSession,
		getStripeSessionStatus,
	};
});
