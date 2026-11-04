<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-white">Gestión de Pagos</h1>
        <p class="text-sm text-text-sub mt-1">
          Auditoría de ingresos y conciliación de transacciones
        </p>
      </div>

      <div class="flex items-center gap-3">
        <button v-if="userRole === 3" type="button" @click="showPayModal = true"
          class="btn-primary h-10! text-xs! px-4 flex items-center gap-1.5 cursor-pointer">
          <Plus class="w-4 h-4" /> Cobrar en Mostrador
        </button>
      </div>
    </div>

    <div v-if="revenue" class="gradient-gold-dark rounded-3xl p-6 border border-primary/30">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p class="text-xs text-text-sub font-semibold uppercase tracking-wider">
            TOTAL RECAUDADO • {{ revenue.gymName }}
          </p>
          <p class="text-3xl font-black text-primary mt-1">
            ${{ revenue.totalRevenue.toLocaleString("es-MX", { minimumFractionDigits: 2 }) }} MXN
          </p>
          <p class="text-xs text-text-sub mt-1">
            {{ revenue.totalTransactions }} transacciones completadas
          </p>
        </div>
      </div>
    </div>

    <div class="bg-surface border border-surface-light rounded-3xl overflow-hidden">
      <div v-if="loading && payments.length === 0" class="p-8 text-center text-text-sub text-xs">
        Cargando transacciones...
      </div>

      <div v-else-if="payments.length === 0" class="p-12 text-center space-y-2">
        <Receipt class="w-10 h-10 text-text-muted mx-auto" />
        <p class="text-sm font-semibold text-white">No hay transacciones registradas</p>
        <p class="text-xs text-text-sub">Los pagos de suscripciones y pases aparecerán aquí.</p>
      </div>

      <div v-else class="divide-y divide-surface-light">
        <div v-for="payment in payments" :key="payment.id"
          class="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-surface-light/30 transition">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs"
              :class="payment.paymentStatusName === 'Pagado' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'">
              <CreditCard v-if="payment.paymentMethodId === 2" class="w-5 h-5" />
              <Banknote v-else class="w-5 h-5" />
            </div>
            <div>
              <h2 class="text-sm font-bold text-white">Folio #{{ payment.id }}</h2>
              <p class="text-xs text-text-sub">
                {{ payment.paymentMethodName }} • {{ payment.gymName }}
              </p>
              <p class="text-[10px] text-text-muted">
                {{ formatDate(payment.paymentDate || payment.createdAt) }}
              </p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-sm font-bold"
              :class="payment.paymentStatusName === 'Pagado' ? 'text-primary' : 'text-text-sub'">
              +${{ payment.amount.toLocaleString("es-MX", { minimumFractionDigits: 2 }) }}
            </p>
            <span class="text-[10px] font-bold"
              :class="payment.paymentStatusName === 'Pagado' ? 'text-success' : 'text-warning'">
              {{ payment.paymentStatusName }}
            </span>
          </div>
        </div>
      </div>

      <div v-if="totalPages > 1" class="p-4 border-t border-surface-light flex items-center justify-between">
        <span class="text-xs text-text-sub">Página {{ currentPage }} de {{ totalPages }} ({{ total }} registros)</span>
        <div class="flex gap-2">
          <button type="button" :disabled="currentPage <= 1" @click="changePage(currentPage - 1)"
            class="px-3 py-1 rounded-lg bg-surface-light text-xs text-white disabled:opacity-40">
            Anterior
          </button>
          <button type="button" :disabled="currentPage >= totalPages" @click="changePage(currentPage + 1)"
            class="px-3 py-1 rounded-lg bg-surface-light text-xs text-white disabled:opacity-40">
            Siguiente
          </button>
        </div>
      </div>
    </div>

    <div v-if="showPayModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div class="bg-surface border border-surface-light rounded-3xl w-full max-w-md p-6 space-y-4">
        <div class="flex justify-between items-center pb-2 border-b border-surface-light">
          <h3 class="text-lg font-bold text-white">Cobro en Mostrador</h3>
          <button type="button" @click="showPayModal = false"
            class="p-1 rounded-xl text-text-sub hover:text-white cursor-pointer">
            <X class="w-5 h-5" />
          </button>
        </div>

        <form @submit.prevent="handleRegisterCashPayment" class="space-y-4">
          <MoleculesInputField id="amount" label="Monto a Cobrar ($)" type="number" inputmode="decimal"
            v-model="cashForm.amount" required />

          <div>
            <label class="block text-xs font-semibold text-text-sub mb-1">Método de Pago</label>
            <select v-model="cashForm.paymentMethodId" class="input-field">
              <option :value="1">Efectivo (Requiere Turno Abierto)</option>
              <option :value="2">Terminal Tarjeta</option>
            </select>
          </div>

          <div class="flex gap-3 pt-2">
            <button type="button" @click="showPayModal = false"
              class="btn-secondary h-11! text-xs! flex-1 cursor-pointer">
              Cancelar
            </button>
            <button type="submit" :disabled="loading || cashForm.amount <= 0"
              class="btn-primary h-11! text-xs! flex-1 cursor-pointer">
              {{ loading ? "Procesando..." : "Confirmar Cobro" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Banknote, CreditCard, Plus, Receipt, X } from "lucide-vue-next";
import { useToast } from "vue-toastification";

definePageMeta({
	layout: "admin",
	requiresAuth: true,
	roles: [2, 3],
});

const toast = useToast();
const authStore = useAuthStore();
const gymStore = useGymStore();
const paymentStore = usePaymentStore();

const { authData } = storeToRefs(authStore);
const { gymForm } = storeToRefs(gymStore);
const { payments, total, totalPages, currentPage, revenue, loading } =
	storeToRefs(paymentStore);

const userRole = computed(() => authData.value?.roleId ?? 0);
const showPayModal = ref(false);

const cashForm = reactive({
	amount: 0,
	paymentMethodId: 1,
});

const formatDate = (dateStr: string) => {
	if (!dateStr) return "";
	return new Date(dateStr).toLocaleDateString("es-MX", {
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
};

const loadData = async (page = 1) => {
	const gymId = gymForm.value.id;
	if (!gymId) return;
	await Promise.all([
		paymentStore.getPaymentsByGym(gymId, page),
		paymentStore.getRevenueByGym(gymId),
	]);
};

const changePage = (page: number) => {
	loadData(page);
};

const handleRegisterCashPayment = async () => {
	const gymId = gymForm.value.id;
	if (!gymId) {
		toast.error("No se encontró el gimnasio asociado");
		return;
	}

	const res = await paymentStore.registerCashPayment({
		gym_id: gymId,
		payment_method_id: cashForm.paymentMethodId,
		amount: Number(cashForm.amount),
	});

	if (res) {
		toast.success("Pago registrado exitosamente");
		showPayModal.value = false;
		cashForm.amount = 0;
		await loadData(1);
	}
};

onMounted(async () => {
	if (!gymForm.value.id) {
		await gymStore.getMyGym();
	}
	await loadData(1);
});
</script>
