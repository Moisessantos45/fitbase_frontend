<template>
	<MoleculesBaseModal
		:hidden="showDayPassModal"
		title="Agendar Pase de Un Solo Uso"
		width="580px"
		:hide-footer="true"
		@cancel="daypassStore.closeDayPass"
	>
		<div v-if="selectedGym" class="space-y-5">
			<div class="bg-bg-base/70 p-4 rounded-2xl border border-surface-light flex items-start gap-3">
				<div class="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
					<Ticket class="w-5 h-5" />
				</div>
				<div class="min-w-0 flex-1">
					<p class="text-xs font-bold text-white">{{ selectedGym.name }}</p>
					<p v-if="selectedGym.address" class="text-[11px] text-text-sub mt-0.5 truncate">{{ selectedGym.address }}</p>
					<div class="mt-2 flex items-center gap-2">
						<span class="text-[10px] font-bold px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
							Pase de 1 Solo Uso
						</span>
						<span class="text-[10px] text-text-muted">
							Acceso con Código QR
						</span>
					</div>
				</div>
			</div>

			<div v-if="loadingPlans" class="p-8 text-center">
				<div class="inline-block w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
				<p class="text-xs text-text-sub mt-2">Cargando planes de un solo uso...</p>
			</div>

			<div v-else-if="availablePassPlans.length === 0" class="p-4 rounded-xl bg-surface-light/30 border border-surface-light text-center space-y-2">
				<AlertCircle class="w-6 h-6 text-warning mx-auto opacity-80" />
				<p class="text-xs font-bold text-white">No hay pases de un solo uso configurados</p>
				<p class="text-[11px] text-text-sub">Esta sede no cuenta actualmente con un plan de visita de 1 día habilitado.</p>
			</div>

			<div v-else class="space-y-4">
				<div v-if="!authenticated" class="p-4 rounded-2xl bg-surface-light/30 border border-primary/20 space-y-3">
					<div class="flex items-center gap-2 text-primary font-bold text-xs">
						<Sparkles class="w-4 h-4" />
						Datos del Visitante (Sin necesidad de cuenta)
					</div>
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
						<div class="space-y-1 sm:col-span-2">
							<label class="text-[11px] font-bold text-text-sub block">Nombre Completo *</label>
							<input
								type="text"
								v-model="guestForm.fullName"
								placeholder="Ej. Juan Pérez"
								class="input-field h-10! py-1.5! text-xs w-full"
							/>
						</div>
						<div class="space-y-1">
							<label class="text-[11px] font-bold text-text-sub block">Teléfono / WhatsApp *</label>
							<input
								type="tel"
								v-model="guestForm.phone"
								placeholder="+52 55..."
								class="input-field h-10! py-1.5! text-xs w-full"
							/>
						</div>
						<div class="space-y-1">
							<label class="text-[11px] font-bold text-text-sub block">Correo Electrónico *</label>
							<input
								type="email"
								v-model="guestForm.email"
								placeholder="ejemplo@correo.com"
								class="input-field h-10! py-1.5! text-xs w-full"
							/>
						</div>
					</div>
				</div>

				<div class="space-y-1.5">
					<label class="text-xs font-bold text-white block">
						Selecciona el tipo de pase:
					</label>
					<div class="space-y-2">
						<div
							v-for="plan in availablePassPlans"
							:key="plan.id"
							@click="selectPlan(plan)"
							class="p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between"
							:class="selectedPlanId === plan.id ? 'bg-primary/10 border-primary shadow-sm' : 'bg-surface-light/30 border-surface-light hover:border-surface-hover'"
						>
							<div class="flex items-center gap-3">
								<div class="w-4 h-4 rounded-full border flex items-center justify-center shrink-0" :class="selectedPlanId === plan.id ? 'border-primary bg-primary' : 'border-text-muted'">
									<div v-if="selectedPlanId === plan.id" class="w-1.5 h-1.5 rounded-full bg-black"></div>
								</div>
								<div>
									<p class="text-xs font-bold text-white">{{ plan.name }}</p>
									<p class="text-[11px] text-text-sub line-clamp-1">{{ plan.description || 'Pase de acceso de 1 uso' }}</p>
								</div>
							</div>
							<div class="text-right shrink-0">
								<span class="text-sm font-black text-primary">${{ plan.price }}</span>
								<span class="text-[10px] text-text-muted block">1 día</span>
							</div>
						</div>
					</div>
				</div>

				<div class="space-y-1.5">
					<label class="text-xs font-bold text-white flex items-center gap-1.5">
						<Calendar class="w-3.5 h-3.5 text-primary" />
						Fecha programada de visita:
					</label>
					<input
						type="date"
						v-model="visitDate"
						:min="minVisitDate"
						class="input-field h-11! py-2! text-xs font-medium w-full"
					/>
					<p class="text-[10px] text-text-muted">
						El pase es válido únicamente para el día agendado y se consumirá en tu primer escaneo.
					</p>
				</div>

				<div v-if="lastError" class="p-3 rounded-xl bg-error/10 border border-error/20 flex items-start gap-2 text-error text-xs">
					<AlertCircle class="w-4 h-4 shrink-0 mt-0.5" />
					<span>{{ lastError }}</span>
				</div>

				<div class="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2">
					<button
						type="button"
						@click="daypassStore.closeDayPass"
						class="btn-secondary h-10! text-xs! px-4! cursor-pointer"
					>
						Cancelar
					</button>
					<button
						type="button"
						@click="confirmPurchase"
						:disabled="loading || loadingPayment || !selectedPlanId || !visitDate || (!authenticated && !isGuestFormValid)"
						class="btn-secondary h-10! text-xs! px-4! flex items-center justify-center gap-1.5 font-bold cursor-pointer disabled:opacity-50 text-white"
						:title="authenticated ? 'Generar pase directo' : 'Generar pase para pagar en mostrador al llegar'"
					>
						<div v-if="loading" class="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
						<Ticket v-else class="w-3.5 h-3.5 text-primary" />
						{{ authenticated ? "Generar Boleto QR" : "Pagar en Recepción" }}
					</button>
					<button
						type="button"
						@click="payWithStripe"
						:disabled="loading || loadingPayment || !selectedPlanId || !visitDate || (!authenticated && !isGuestFormValid)"
						class="btn-primary h-10! text-xs! px-4! flex items-center justify-center gap-1.5 font-bold cursor-pointer disabled:opacity-50 shadow-md"
					>
						<div v-if="loadingPayment" class="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
						<CreditCard v-else class="w-3.5 h-3.5" />
						Pagar con Tarjeta (${{ selectedPlanPrice }})
					</button>
				</div>
			</div>
		</div>
	</MoleculesBaseModal>
</template>

<script setup lang="ts">
import {
	AlertCircle,
	Calendar,
	CreditCard,
	Sparkles,
	Ticket,
} from "lucide-vue-next";

const daypassStore = useDayPassStore();
const planStore = usePlanStore();
const authStore = useAuthStore();
const paymentStore = usePaymentStore();

const { selectedGym, showDayPassModal, currentTicket, loading, lastError } =
	storeToRefs(daypassStore);
const { plans, loading: loadingPlans } = storeToRefs(planStore);
const { authenticated } = storeToRefs(authStore);
const { checkoutSession, loading: loadingPayment } = storeToRefs(paymentStore);

const selectedPlanId = ref<number | undefined>(undefined);
const visitDate = ref("");
const minVisitDate = ref("");

const guestForm = reactive({
	fullName: "",
	phone: "",
	email: "",
});

const isGuestFormValid = computed(() => {
	return (
		guestForm.fullName.trim().length >= 2 &&
		guestForm.phone.trim().length >= 7 &&
		guestForm.email.includes("@")
	);
});

const selectPlan = (plan: Plan) => {
	if (plan.id !== undefined) {
		selectedPlanId.value = plan.id;
	}
};

const getTodayString = () => {
	const now = new Date();
	const year = now.getFullYear();
	const month = String(now.getMonth() + 1).padStart(2, "0");
	const day = String(now.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
};

const availablePassPlans = computed(() => {
	const list = plans.value.filter((p) => p.active);
	const passes = list.filter((p) => {
		const pType = (p.planType || "").toLowerCase();
		const pName = (p.name || "").toLowerCase();
		return (
			p.duration <= 1 ||
			(p.maxVisits !== null && p.maxVisits !== undefined && p.maxVisits <= 1) ||
			pType.includes("pase") ||
			pType.includes("dia") ||
			pType.includes("daypass") ||
			pType.includes("visita") ||
			pName.includes("unico") ||
			pName.includes("pase")
		);
	});
	return passes.length > 0 ? passes : list;
});

const selectedPlanPrice = computed(() => {
	const found = availablePassPlans.value.find(
		(p) => p.id === selectedPlanId.value,
	);
	return found?.price ?? 0;
});

watch(
	() => selectedGym.value,
	async (gym) => {
		if (gym?.id) {
			const today = getTodayString();
			visitDate.value = today;
			minVisitDate.value = today;
			await planStore.getPlansByGym(gym.id);
		}
	},
	{ immediate: true },
);

watch(
	availablePassPlans,
	(list) => {
		if (list.length > 0 && list[0]?.id !== undefined) {
			selectedPlanId.value = list[0].id;
		} else {
			selectedPlanId.value = undefined;
		}
	},
	{ immediate: true },
);

const confirmPurchase = async () => {
	if (!selectedGym.value?.id || !selectedPlanId.value || !visitDate.value) {
		return;
	}

	if (!authenticated.value) {
		if (!isGuestFormValid.value) return;
		await daypassStore.createPublicDayPass({
			gym_id: selectedGym.value.id,
			plan_id: selectedPlanId.value,
			full_name: guestForm.fullName.trim(),
			phone: guestForm.phone.trim(),
			email: guestForm.email.trim(),
			visit_date: visitDate.value,
		});
	} else {
		await daypassStore.purchaseDayPass({
			gym_id: selectedGym.value.id,
			plan_id: selectedPlanId.value,
			visit_date: visitDate.value,
		});
	}

	if (currentTicket.value) {
		daypassStore.closeDayPass();
		daypassStore.openTicket();
	}
};

const payWithStripe = async () => {
	if (!selectedGym.value?.id || !selectedPlanId.value || !visitDate.value) {
		return;
	}

	if (!authenticated.value) {
		if (!isGuestFormValid.value) return;
		await paymentStore.createGuestCheckoutSession({
			gym_id: selectedGym.value.id,
			plan_id: selectedPlanId.value,
			full_name: guestForm.fullName.trim(),
			phone: guestForm.phone.trim(),
			email: guestForm.email.trim(),
			visit_date: visitDate.value,
		});
	} else {
		await paymentStore.createStripeCheckoutSession({
			gym_id: selectedGym.value.id,
			plan_id: selectedPlanId.value,
			type: "daypass",
			visit_date: visitDate.value,
			auto_renew: false,
		});
	}

	if (checkoutSession.value?.checkoutUrl) {
		if (typeof window !== "undefined") {
			window.location.href = checkoutSession.value.checkoutUrl;
		}
	}
};
</script>
