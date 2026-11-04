<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-white">Pagos y Recibos</h1>
        <p class="text-sm text-text-sub mt-1">
          Historial y comprobantes de todas tus transacciones en Fitbase
        </p>
      </div>

      <NuxtLink
        to="/subscriptions"
        class="btn-secondary h-10! text-xs! px-4 flex items-center gap-2 cursor-pointer w-fit"
      >
        <Calendar class="w-4 h-4 text-primary" /> Ver Mis Membresías
      </NuxtLink>
    </div>

    <div v-if="payments.length > 0" class="gradient-gold-dark rounded-3xl p-6 border border-primary/30 shadow-xl">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span class="text-xs font-semibold text-text-sub uppercase tracking-wider">
            ÚLTIMO PAGO REGISTRADO
          </span>
          <h2 class="text-xl font-bold text-white mt-1">
            {{ payments[0]?.gymName }}
          </h2>
          <p class="text-xs text-text-sub mt-1">
            Realizado el {{ formatDate(payments[0]?.paymentDate || payments[0]?.createdAt || "") }} mediante {{ payments[0]?.paymentMethodName }}
          </p>
        </div>
        <div class="text-right sm:text-right">
          <span class="text-2xl font-black text-primary">
            +${{ payments[0]?.amount.toLocaleString("es-MX", { minimumFractionDigits: 2 }) }}
          </span>
          <span class="block text-[10px] font-bold text-success uppercase mt-0.5">
            {{ payments[0]?.paymentStatusName }}
          </span>
        </div>
      </div>
    </div>

    <div>
      <h2 class="text-base font-bold text-white mb-3">
        Historial de Transacciones
      </h2>

      <div class="bg-surface border border-surface-light rounded-3xl divide-y divide-surface-light overflow-hidden">
        <div v-if="loading && payments.length === 0" class="p-8 text-center text-text-sub text-xs">
          Cargando tus recibos...
        </div>

        <div v-else-if="payments.length === 0" class="p-12 text-center space-y-2">
          <Receipt class="w-10 h-10 text-text-muted mx-auto" />
          <p class="text-sm font-semibold text-white">No tienes pagos registrados</p>
          <p class="text-xs text-text-sub">
            Aquí podrás consultar los recibos de tus suscripciones y pases diarios.
          </p>
        </div>

        <div
          v-else
          v-for="tx in payments"
          :key="tx.id"
          class="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-surface-light/40 transition"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs"
              :class="tx.paymentStatusName === 'Pagado' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'"
            >
              <CreditCard v-if="tx.paymentMethodId === 2" class="w-5 h-5" />
              <Banknote v-else class="w-5 h-5" />
            </div>
            <div>
              <h3 class="text-sm font-bold text-white">{{ tx.gymName }}</h3>
              <p class="text-xs text-text-sub">
                Folio #{{ tx.id }} • {{ tx.paymentMethodName }} • {{ formatDate(tx.paymentDate || tx.createdAt) }}
              </p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-sm font-black text-primary">
              ${{ tx.amount.toLocaleString("es-MX", { minimumFractionDigits: 2 }) }}
            </p>
            <span
              class="text-[10px] font-bold"
              :class="tx.paymentStatusName === 'Pagado' ? 'text-success' : 'text-warning'"
            >
              {{ tx.paymentStatusName }}
            </span>
          </div>
        </div>
      </div>

      <div v-if="totalPages > 1" class="p-4 flex items-center justify-between">
        <span class="text-xs text-text-sub">Página {{ currentPage }} de {{ totalPages }}</span>
        <div class="flex gap-2">
          <button
            type="button"
            :disabled="currentPage <= 1"
            @click="changePage(currentPage - 1)"
            class="px-3 py-1 rounded-lg bg-surface-light text-xs text-white disabled:opacity-40 cursor-pointer"
          >
            Anterior
          </button>
          <button
            type="button"
            :disabled="currentPage >= totalPages"
            @click="changePage(currentPage + 1)"
            class="px-3 py-1 rounded-lg bg-surface-light text-xs text-white disabled:opacity-40 cursor-pointer"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Banknote, Calendar, CreditCard, Receipt } from "lucide-vue-next";

definePageMeta({
	name: "user-payments",
	layout: "user",
	requiresAuth: true,
	roles: [4],
});

const paymentStore = usePaymentStore();
const { payments, totalPages, currentPage, loading } =
	storeToRefs(paymentStore);

const formatDate = (dateStr: string) => {
	if (!dateStr) return "";
	return new Date(dateStr).toLocaleDateString("es-MX", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
};

const changePage = (page: number) => {
	paymentStore.getMyPayments(page);
};

onMounted(() => {
	paymentStore.getMyPayments(1);
});
</script>
