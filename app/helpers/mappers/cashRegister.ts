const mapperCashRegister = (raw: Record<string, unknown>): CashRegister => {
	return {
		id: getNumber(raw.id),
		gymId: getNumber(raw.gym_id),
		authId: getNumber(raw.auth_id),
		openTime: getString(raw.open_time),
		closeTime: raw.close_time ? getString(raw.close_time) : null,
		openCash: getNumber(raw.open_cash),
		closeCash: getNumber(raw.close_cash),
		isOpen: getBoolean(raw.is_open),
	};
};

const openCashRegisterToJson = (
	payload: OpenCashRegisterPayload,
): Record<string, unknown> => {
	return {
		gym_id: payload.gymId,
		open_cash: payload.openCash,
	};
};

const closeCashRegisterToJson = (
	payload: CloseCashRegisterPayload,
): Record<string, unknown> => {
	return {
		close_cash: payload.closeCash,
	};
};

export { closeCashRegisterToJson, mapperCashRegister, openCashRegisterToJson };
