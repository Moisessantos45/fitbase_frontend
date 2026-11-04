export const useDayPassStore = defineStore("daypass", () => {
	const { exec, loading } = useApiResult();

	const currentTicket = ref<DayPassTicket | null>(null);
	const selectedGym = ref<TargetGym | null>(null);
	const dayPasses = ref<DayPassDetail[]>([]);
	const total = ref(0);
	const totalPages = ref(1);
	const currentPage = ref(1);
	const showDayPassModal = ref(false);
	const showTicketModal = ref(false);
	const showLookupModal = ref(false);
	const savedSlug = ref<string | null>(null);
	const lastError = ref<string | null>(null);

	const openDayPass = (gym: TargetGym) => {
		selectedGym.value = {
			id: gym.id,
			name: gym.name,
			address: gym.address,
		};
		lastError.value = null;
		showDayPassModal.value = true;
	};

	const closeDayPass = () => {
		showDayPassModal.value = false;
		selectedGym.value = null;
		lastError.value = null;
	};

	const openTicket = (ticket?: DayPassTicket) => {
		if (ticket) {
			currentTicket.value = ticket;
		}
		showTicketModal.value = true;
	};

	const closeTicket = () => {
		showTicketModal.value = false;
	};

	const openLookup = () => {
		lastError.value = null;
		showLookupModal.value = true;
	};

	const closeLookup = () => {
		showLookupModal.value = false;
		lastError.value = null;
	};

	const purchaseDayPass = async (payload: CreateDayPassPayload) => {
		lastError.value = null;
		return await exec(() => apiAuth.post("/daypass/purchase", payload), {
			mapper(res) {
				const raw = res.data?.data;
				return mapperDayPassTicket(raw);
			},
			onSuccess: (data) => {
				currentTicket.value = data;
				if (data?.slug) {
					savedSlug.value = data.slug;
					if (typeof window !== "undefined") {
						localStorage.setItem("fitbase_daypass_slug", data.slug);
						localStorage.setItem(
							"fitbase_daypass_ticket",
							JSON.stringify(data),
						);
					}
				}
			},
			onError: (err) => {
				lastError.value = err.msg || "Error al generar el pase de un solo uso";
			},
		});
	};

	const createPublicDayPass = async (payload: RegisterGuestPayload) => {
		lastError.value = null;
		return await exec(() => apiPublic.post("/daypass/guest", payload), {
			mapper(res) {
				const raw = res.data?.data;
				return mapperDayPassTicket(raw);
			},
			onSuccess: (data) => {
				currentTicket.value = data;
				if (data?.slug) {
					savedSlug.value = data.slug;
					if (typeof window !== "undefined") {
						localStorage.setItem("fitbase_daypass_slug", data.slug);
						localStorage.setItem(
							"fitbase_daypass_ticket",
							JSON.stringify(data),
						);
					}
				}
			},
			onError: (err) => {
				lastError.value = err.msg || "Error al generar el pase en línea";
			},
		});
	};

	const registerGuest = async (payload: RegisterGuestPayload) => {
		lastError.value = null;
		return await exec(() => apiAuth.post("/daypass/register-guest", payload), {
			mapper(res) {
				const raw = res.data?.data;
				return mapperDayPassTicket(raw);
			},
			onSuccess: (data) => {
				currentTicket.value = data;
			},
			onError: (err) => {
				lastError.value = err.msg || "Error al registrar invitado en recepción";
			},
		});
	};

	const getDayPassesByGym = async (
		gymId: number,
		page = 1,
		pageSize = 10,
		date?: string,
		search?: string,
	) => {
		lastError.value = null;
		return await exec(
			() =>
				apiAuth.get(`/gyms/${gymId}/daypasses`, {
					params: {
						page,
						page_size: pageSize,
						date: date || undefined,
						search: search || undefined,
					},
				}),
			{
				mapper(res) {
					const mapped = mapperPaginatedDayPasses(res.data.data);
					dayPasses.value = mapped.data;
					total.value = mapped.paginate.total;
					totalPages.value = mapped.paginate.totalPages;
					currentPage.value = mapped.paginate.page;
					return mapped;
				},
				onError: (err) => {
					lastError.value = err.msg || "Error al consultar pases de la sede";
				},
			},
		);
	};

	const getTicketBySlug = async (slug: string) => {
		lastError.value = null;
		return await exec(() => apiPublic.get(`/daypass/${slug}/ticket`), {
			mapper(res) {
				const raw = res.data?.data;
				return mapperDayPassTicket(raw);
			},
			onSuccess: (data) => {
				currentTicket.value = data;
				if (data?.slug) {
					savedSlug.value = data.slug;
					if (typeof window !== "undefined") {
						localStorage.setItem("fitbase_daypass_slug", data.slug);
						localStorage.setItem(
							"fitbase_daypass_ticket",
							JSON.stringify(data),
						);
					}
				}
			},
			onError: (err) => {
				lastError.value = err.msg || "Ticket no encontrado";
			},
		});
	};

	const clearCurrentTicket = () => {
		currentTicket.value = null;
		lastError.value = null;
	};

	return {
		currentTicket,
		selectedGym,
		dayPasses,
		total,
		totalPages,
		currentPage,
		showDayPassModal,
		showTicketModal,
		showLookupModal,
		savedSlug,
		lastError,
		loading,
		openDayPass,
		closeDayPass,
		openTicket,
		closeTicket,
		openLookup,
		closeLookup,
		purchaseDayPass,
		createPublicDayPass,
		registerGuest,
		getDayPassesByGym,
		getTicketBySlug,
		clearCurrentTicket,
	};
});
