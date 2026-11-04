<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-2xl bg-surface-light border border-primary/30 flex items-center justify-center text-primary shadow-lg shadow-primary/5">
          <Shield class="w-6 h-6" />
        </div>
        <div>
          <h1 class="text-xl font-bold text-white">Panel de Administración</h1>
          <p class="text-xs font-semibold text-primary">
            {{ dashboardSummary?.gymName || gymForm.name || "Mi Sede Fitbase" }} • En Vivo
          </p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <NuxtLink
          to="/admin/settings"
          class="w-10 h-10 rounded-xl bg-surface border border-surface-light flex items-center justify-center text-white hover:text-primary transition cursor-pointer"
        >
          <Settings class="w-4 h-4" />
        </NuxtLink>
      </div>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-surface border border-surface-light rounded-3xl p-5 flex flex-col justify-between">
        <div class="flex justify-between items-start">
          <span class="text-xs text-text-sub font-medium">Recaudación Total</span>
          <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <DollarSign class="w-4 h-4" />
          </div>
        </div>
        <div class="mt-4">
          <p class="text-2xl font-black text-white">
            ${{ kpis.totalRevenue.toLocaleString("es-MX", { minimumFractionDigits: 2 }) }}
          </p>
          <p class="text-[11px] font-semibold text-primary mt-1">
            {{ kpis.totalTransactions }} transacciones registradas
          </p>
        </div>
      </div>

      <div class="bg-surface border border-surface-light rounded-3xl p-5 flex flex-col justify-between">
        <div class="flex justify-between items-start">
          <span class="text-xs text-text-sub font-medium">Suscriptores</span>
          <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <BadgeCheck class="w-4 h-4" />
          </div>
        </div>
        <div class="mt-4">
          <p class="text-2xl font-black text-white">{{ kpis.activeSubscribers }}</p>
          <NuxtLink to="/admin/subscribers" class="text-[11px] font-semibold text-primary hover:underline mt-1 block">
            Ver directorio de socios →
          </NuxtLink>
        </div>
      </div>

      <div class="bg-surface border border-surface-light rounded-3xl p-5 flex flex-col justify-between">
        <div class="flex justify-between items-start">
          <span class="text-xs text-text-sub font-medium">Accesos Totales</span>
          <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Activity class="w-4 h-4" />
          </div>
        </div>
        <div class="mt-4">
          <p class="text-2xl font-black text-white">
            {{ kpis.totalCheckIns }}
          </p>
          <p class="text-[11px] font-semibold text-success mt-1">
            Socios y visitantes en puerta
          </p>
        </div>
      </div>

      <div class="bg-surface border border-surface-light rounded-3xl p-5 flex flex-col justify-between">
        <div class="flex justify-between items-start">
          <span class="text-xs text-text-sub font-medium">Hora Pico</span>
          <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Clock class="w-4 h-4" />
          </div>
        </div>
        <div class="mt-4">
          <p class="text-2xl font-black text-white">
            {{ kpis.peakHour > 0 ? `${kpis.peakHour}:00 hrs` : "N/D" }}
          </p>
          <p class="text-[11px] font-semibold text-warning mt-1">
            {{ kpis.peakHourCount }} concurrencia máxima
          </p>
        </div>
      </div>
    </div>

    <div>
      <h2 class="text-sm font-bold text-white mb-3">Accesos Directos</h2>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <NuxtLink
          to="/admin/subscribers"
          class="bg-surface border border-surface-light hover:border-primary/50 rounded-2xl p-4 flex flex-col items-center text-center transition group cursor-pointer"
        >
          <div class="w-11 h-11 rounded-2xl bg-surface-light group-hover:bg-primary/10 flex items-center justify-center text-primary mb-2 transition">
            <Users class="w-5 h-5" />
          </div>
          <span class="text-xs font-semibold text-white">Suscriptores</span>
        </NuxtLink>

        <NuxtLink
          to="/admin/plans"
          class="bg-surface border border-surface-light hover:border-primary/50 rounded-2xl p-4 flex flex-col items-center text-center transition group cursor-pointer"
        >
          <div class="w-11 h-11 rounded-2xl bg-surface-light group-hover:bg-primary/10 flex items-center justify-center text-primary mb-2 transition">
            <Layers class="w-5 h-5" />
          </div>
          <span class="text-xs font-semibold text-white">Planes</span>
        </NuxtLink>

        <NuxtLink
          to="/admin/payments"
          class="bg-surface border border-surface-light hover:border-primary/50 rounded-2xl p-4 flex flex-col items-center text-center transition group cursor-pointer"
        >
          <div class="w-11 h-11 rounded-2xl bg-surface-light group-hover:bg-primary/10 flex items-center justify-center text-primary mb-2 transition">
            <Banknote class="w-5 h-5" />
          </div>
          <span class="text-xs font-semibold text-white">Pagos</span>
        </NuxtLink>

        <NuxtLink
          to="/admin/analytics"
          class="bg-surface border border-surface-light hover:border-primary/50 rounded-2xl p-4 flex flex-col items-center text-center transition group cursor-pointer"
        >
          <div class="w-11 h-11 rounded-2xl bg-surface-light group-hover:bg-primary/10 flex items-center justify-center text-primary mb-2 transition">
            <TrendingUp class="w-5 h-5" />
          </div>
          <span class="text-xs font-semibold text-white">Analítica</span>
        </NuxtLink>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-surface border border-surface-light rounded-3xl p-6 space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-sm font-bold text-white flex items-center gap-2">
            <Receipt class="w-4 h-4 text-primary" /> Últimas Transacciones
          </h2>
          <NuxtLink to="/admin/payments" class="text-xs font-bold text-primary hover:underline">
            Ver todas →
          </NuxtLink>
        </div>

        <div v-if="loading && recentPayments.length === 0" class="p-6 text-center text-text-sub text-xs">
          Cargando cobros...
        </div>

        <div v-else-if="recentPayments.length === 0" class="p-8 text-center text-text-sub text-xs">
          Aún no hay transacciones registradas.
        </div>

        <div v-else class="divide-y divide-surface-light">
          <div
            v-for="tx in recentPayments"
            :key="tx.id"
            class="py-3 flex items-center justify-between gap-3"
          >
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-surface-light flex items-center justify-center text-primary font-bold text-xs">
                <CreditCard v-if="tx.paymentMethodName.toLowerCase().includes('tarjeta')" class="w-4 h-4" />
                <Banknote v-else class="w-4 h-4" />
              </div>
              <div>
                <p class="text-xs font-bold text-white">Folio #{{ tx.id }}</p>
                <p class="text-[10px] text-text-sub">{{ tx.paymentMethodName }} • {{ formatDate(tx.paymentDate) }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-xs font-bold text-primary">
                +${{ tx.amount.toLocaleString("es-MX", { minimumFractionDigits: 2 }) }}
              </p>
              <span class="text-[10px] font-bold text-success">{{ tx.paymentStatusName }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-surface border border-surface-light rounded-3xl p-6 space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-sm font-bold text-white flex items-center gap-2">
            <Clock class="w-4 h-4 text-primary" /> Turnos de Caja Recientes
          </h2>
          <NuxtLink to="/admin/analytics" class="text-xs font-bold text-primary hover:underline">
            Ver auditoría →
          </NuxtLink>
        </div>

        <div v-if="loading && recentShifts.length === 0" class="p-6 text-center text-text-sub text-xs">
          Cargando turnos...
        </div>

        <div v-else-if="recentShifts.length === 0" class="p-8 text-center text-text-sub text-xs">
          Aún no hay turnos de caja registrados.
        </div>

        <div v-else class="divide-y divide-surface-light">
          <div
            v-for="shift in recentShifts"
            :key="shift.shiftId"
            class="py-3 flex items-center justify-between gap-3"
          >
            <div>
              <p class="text-xs font-bold text-white">{{ shift.managerName }}</p>
              <p class="text-[10px] text-text-sub">
                {{ formatDate(shift.openTime) }} • {{ shift.closeTime ? "Cerrada" : "En curso" }}
              </p>
            </div>
            <div class="text-right">
              <span
                class="text-[10px] font-bold px-2 py-0.5 rounded-full"
                :class="
                  shift.status === 'Cuadrada'
                    ? 'bg-success/10 text-success'
                    : shift.status === 'Con Descuadre'
                      ? 'bg-error/10 text-error'
                      : 'bg-primary/10 text-primary'
                "
              >
                {{ shift.status }}
              </span>
              <p class="text-[10px] text-text-muted mt-1">
                Fondo: ${{ shift.openCash.toFixed(2) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
	Activity,
	BadgeCheck,
	Banknote,
	Clock,
	CreditCard,
	DollarSign,
	Layers,
	Receipt,
	Settings,
	Shield,
	TrendingUp,
	Users,
} from "lucide-vue-next";

definePageMeta({
	layout: "admin",
	requiresAuth: true,
	roles: [2, 3],
});

const gymStore = useGymStore();
const analyticsStore = useAnalyticsStore();

const { gymForm } = storeToRefs(gymStore);
const { dashboardSummary, loading } = storeToRefs(analyticsStore);

const kpis = computed(
	() =>
		dashboardSummary.value?.kpis ?? {
			totalRevenue: 0,
			totalTransactions: 0,
			activeSubscribers: 0,
			totalCheckIns: 0,
			peakHour: 0,
			peakHourCount: 0,
		},
);

const recentPayments = computed(
	() => dashboardSummary.value?.recentPayments ?? [],
);
const recentShifts = computed(() => dashboardSummary.value?.recentShifts ?? []);

const formatDate = (dateStr: string) => {
	if (!dateStr) return "";
	return new Date(dateStr).toLocaleDateString("es-MX", {
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
};

const loadDashboard = async () => {
	const gymId = gymForm.value.id;
	if (!gymId) return;
	await analyticsStore.getDashboardSummary(gymId);
};

onMounted(async () => {
	if (!gymForm.value.id) {
		await gymStore.getMyGym();
	}
	await loadDashboard();
});
</script>
