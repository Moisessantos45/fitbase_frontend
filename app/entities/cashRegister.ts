interface CashRegister {
	id: number;
	gymId: number;
	authId: number;
	openTime: string;
	closeTime: string | null;
	openCash: number;
	closeCash: number;
	isOpen: boolean;
}

interface OpenCashRegisterPayload {
	gymId: number;
	openCash: number;
}

interface CloseCashRegisterPayload {
	closeCash: number;
}

export type { CashRegister, CloseCashRegisterPayload, OpenCashRegisterPayload };
