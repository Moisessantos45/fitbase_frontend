export const useCashRegisterStore = defineStore("cashRegister", () => {
	const { exec, loading } = useApiResult();

	const currentRegister = ref<CashRegister | null>(null);

	const getCurrentRegister = async () => {
		return await exec(() => apiAuth.get("/cash-register/current"), {
			mapper(res) {
				const raw = res.data?.data;
				if (!isRecord(raw)) return null;
				return mapperCashRegister(raw);
			},
			onSuccess: (data) => {
				currentRegister.value = data;
			},
			onError: (_) => {
				currentRegister.value = null;
			},
		});
	};

	const openRegister = async (payload: OpenCashRegisterPayload) => {
		return await exec(
			() =>
				apiAuth.post("/cash-register/open", openCashRegisterToJson(payload)),
			{
				mapper(res) {
					const raw = res.data?.data;
					if (!isRecord(raw)) {
						throw new Error("Error al abrir la caja");
					}
					return mapperCashRegister(raw);
				},
				onSuccess: (data) => {
					currentRegister.value = data;
				},
				onError: (_) => {},
			},
		);
	};

	const closeRegister = async (payload: CloseCashRegisterPayload) => {
		return await exec(
			() =>
				apiAuth.post("/cash-register/close", closeCashRegisterToJson(payload)),
			{
				mapper(res) {
					const raw = res.data?.data;
					if (!isRecord(raw)) {
						throw new Error("Error al cerrar la caja");
					}
					return mapperCashRegister(raw);
				},
				onSuccess: (_) => {
					currentRegister.value = null;
				},
				onError: (_) => {},
			},
		);
	};

	return {
		currentRegister,
		loading,
		getCurrentRegister,
		openRegister,
		closeRegister,
	};
});
