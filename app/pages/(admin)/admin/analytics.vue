<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-white">Analítica y Auditoría</h1>
        <p class="text-sm text-text-sub mt-1">
          Métricas de desempeño, afluencia y arqueo de turnos de caja
        </p>
      </div>

      <div class="flex items-center gap-2">
        <input
          type="date"
          v-model="filters.from"
          @change="loadAllAnalytics"
          class="input-field h-10! text-xs! py-0! w-auto"
        />
        <span class="text-xs text-text-sub">a</span>
        <input
          type="date"
          v-model="filters.to"
          @change="loadAllAnalytics"
          class="input-field h-10! text-xs! py-0! w-auto"
        />
      </div>
    </div>

    <div class="flex border-b border-surface-light gap-4 text-xs font-bold">
      <button
        type="button"
        @click="activeTab = 'shifts'"
        class="pb-3 border-b-2 transition cursor-pointer"
        :class="activeTab === 'shifts' ? 'border-primary text-primary' : 'border-transparent text-text-sub hover:text-white'"
      >
        Auditoría de Turnos de Caja
      </button>
      <button
        type="button"
        @click="activeTab = 'attendance'"
        class="pb-3 border-b-2 transition cursor-pointer"
        :class="activeTab === 'attendance' ? 'border-primary text-primary' : 'border-transparent text-text-sub hover:text-white'"
      >
        Afluencia y Horas Pico
      </button>
      <button
        type="button"
        @click="activeTab = 'revenue'"
        class="pb-3 border-b-2 transition cursor-pointer"
        :class="activeTab === 'revenue' ? 'border-primary text-primary' : 'border-transparent text-text-sub hover:text-white'"
      >
        Ingresos Cruzados
      </button>
    </div>

    <div v-if="activeTab === 'shifts'" class="space-y-4">
      <div class="bg-surface border border-surface-light rounded-3xl overflow-hidden">
        <div v-if="loading && shifts.length === 0" class="p-8 text-center text-text-sub text-xs">
          Cargando auditoría de turnos...
        </div>

        <div v-else-if="shifts.length === 0" class="p-12 text-center space-y-2">
          <Clock class="w-10 h-10 text-text-muted mx-auto" />
          <p class="text-sm font-semibold text-white">No hay turnos registrados en este rango</p>
          <p class="text-xs text-text-sub">Las aperturas y cortes de los encargados aparecerán aquí.</p>
        </div>

        <div v-else class="divide-y divide-surface-light">
          <div
            v-for="shift in shifts"
            :key="shift.shiftId"
            class="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-surface-light/30 transition"
          >
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="text-sm font-bold text-white">{{ shift.managerName }}</span>
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
              </div>
              <p class="text-xs text-text-sub">
                Apertura: {{ formatDate(shift.openTime) }} • Cierre: {{ shift.closeTime ? formatDate(shift.closeTime) : "En curso" }}
              </p>
            </div>

            <div class="flex items-center gap-6 text-right">
              <div>
                <p class="text-[10px] text-text-sub uppercase font-bold">Fondo Inicial</p>
                <p class="text-xs font-semibold text-white">${{ shift.openCash.toFixed(2) }}</p>
              </div>
              <div>
                <p class="text-[10px] text-text-sub uppercase font-bold">Cobrado</p>
                <p class="text-xs font-semibold text-white">${{ shift.totalCollected.toFixed(2) }}</p>
              </div>
              <div>
                <p class="text-[10px] text-text-sub uppercase font-bold">Cierre Reportado</p>
                <p class="text-xs font-semibold text-white">${{ shift.closeCash.toFixed(2) }}</p>
              </div>
              <div>
                <p class="text-[10px] text-text-sub uppercase font-bold">Diferencia</p>
                <p
                  class="text-sm font-black"
                  :class="shift.difference === 0 ? 'text-success' : shift.difference > 0 ? 'text-info' : 'text-error'"
                >
                  {{ shift.difference > 0 ? '+' : '' }}${{ shift.difference.toFixed(2) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="activeTab === 'attendance'" class="space-y-6">
      <div v-if="attendance" class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div class="bg-surface border border-surface-light rounded-3xl p-5">
          <p class="text-xs text-text-sub font-medium">Accesos Totales</p>
          <p class="text-2xl font-black text-white mt-2">{{ attendance.totalCheckIns }}</p>
          <p class="text-[11px] text-primary mt-1">Registrados en puerta</p>
        </div>

        <div class="bg-surface border border-surface-light rounded-3xl p-5">
          <p class="text-xs text-text-sub font-medium">Hora Pico</p>
          <p class="text-2xl font-black text-white mt-2">{{ attendance.peakHour }}:00 hrs</p>
          <p class="text-[11px] text-warning mt-1">{{ attendance.peakHourCount }} personas concurrentes</p>
        </div>

        <div class="bg-surface border border-surface-light rounded-3xl p-5">
          <p class="text-xs text-text-sub font-medium">Por Membresía</p>
          <p class="text-2xl font-black text-white mt-2">{{ attendance.membershipsCount }}</p>
          <p class="text-[11px] text-success mt-1">Socios recurrentes</p>
        </div>

        <div class="bg-surface border border-surface-light rounded-3xl p-5">
          <p class="text-xs text-text-sub font-medium">Pases y Visitas</p>
          <p class="text-2xl font-black text-white mt-2">{{ attendance.dayPassesCount + attendance.guestsCount }}</p>
          <p class="text-[11px] text-text-sub mt-1">{{ attendance.dayPassesCount }} pases • {{ attendance.guestsCount }} invitados</p>
        </div>
      </div>

      <div v-if="attendance && attendance.hourlyDistribution.length > 0" class="bg-surface border border-surface-light rounded-3xl p-6">
        <h3 class="text-sm font-bold text-white mb-4">Distribución Horaria de Concurrencia (0 a 23 hrs)</h3>
        <div class="space-y-2">
          <div
            v-for="item in attendance.hourlyDistribution"
            :key="item.hour"
            class="flex items-center gap-3 text-xs"
          >
            <span class="w-16 font-mono text-text-sub shrink-0">{{ String(item.hour).padStart(2, '0') }}:00 hrs</span>
            <div class="flex-1 bg-surface-light rounded-full h-3 overflow-hidden">
              <div
                class="bg-primary h-full rounded-full transition-all duration-500"
                :style="{ width: `${Math.min(100, (item.count / (attendance.peakHourCount || 1)) * 100)}%` }"
              ></div>
            </div>
            <span class="w-10 text-right font-bold text-white shrink-0">{{ item.count }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="activeTab === 'revenue'" class="space-y-6">
      <div v-if="crossRevenue" class="gradient-gold-dark rounded-3xl p-6 border border-primary/30">
        <p class="text-xs text-text-sub font-semibold uppercase tracking-wider">Total Ingresos Periodo</p>
        <p class="text-3xl font-black text-primary mt-1">
          ${{ crossRevenue.totalRevenue.toLocaleString("es-MX", { minimumFractionDigits: 2 }) }} MXN
        </p>
      </div>

      <div v-if="crossRevenue" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-surface border border-surface-light rounded-3xl p-6 space-y-4">
          <h3 class="text-sm font-bold text-white flex items-center gap-2">
            <CreditCard class="w-4 h-4 text-primary" /> Ingresos por Método de Pago
          </h3>
          <div class="divide-y divide-surface-light">
            <div
              v-for="m in crossRevenue.byPaymentMethod"
              :key="m.paymentMethodId"
              class="py-3 flex items-center justify-between"
            >
              <div>
                <p class="text-xs font-bold text-white">{{ m.paymentMethodName }}</p>
                <p class="text-[10px] text-text-sub">{{ m.transactionCount }} transacciones</p>
              </div>
              <p class="text-xs font-black text-primary">
                ${{ m.totalRevenue.toLocaleString("es-MX", { minimumFractionDigits: 2 }) }}
              </p>
            </div>
          </div>
        </div>

        <div class="bg-surface border border-surface-light rounded-3xl p-6 space-y-4">
          <h3 class="text-sm font-bold text-white flex items-center gap-2">
            <Layers class="w-4 h-4 text-primary" /> Ingresos por Plan de Membresía
          </h3>
          <div class="divide-y divide-surface-light">
            <div
              v-for="p in crossRevenue.byPlan"
              :key="p.planId"
              class="py-3 flex items-center justify-between"
            >
              <div>
                <p class="text-xs font-bold text-white">{{ p.planName }}</p>
                <p class="text-[10px] text-text-sub">{{ p.subscriptionCount }} ventas</p>
              </div>
              <p class="text-xs font-black text-primary">
                ${{ p.totalRevenue.toLocaleString("es-MX", { minimumFractionDigits: 2 }) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Clock, CreditCard, Layers } from "lucide-vue-next";

definePageMeta({
	layout: "admin",
	requiresAuth: true,
	roles: [2],
});

const gymStore = useGymStore();
const analyticsStore = useAnalyticsStore();

const { gymForm } = storeToRefs(gymStore);
const { shifts, attendance, crossRevenue, loading } =
	storeToRefs(analyticsStore);

const activeTab = ref<"shifts" | "attendance" | "revenue">("shifts");

const filters = reactive({
	from: "",
	to: "",
});

const formatDate = (dateStr: string) => {
	if (!dateStr) return "";
	return new Date(dateStr).toLocaleDateString("es-MX", {
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
};

const loadAllAnalytics = async () => {
	const gymId = gymForm.value.id;
	if (!gymId) return;

	await Promise.all([
		analyticsStore.getShiftsReport(
			gymId,
			1,
			20,
			filters.from || undefined,
			filters.to || undefined,
		),
		analyticsStore.getAttendanceReport(
			gymId,
			filters.from || undefined,
			filters.to || undefined,
		),
		analyticsStore.getCrossRevenueReport(
			gymId,
			filters.from || undefined,
			filters.to || undefined,
		),
	]);
};

onMounted(async () => {
	if (!gymForm.value.id) {
		await gymStore.getMyGym();
	}
	await loadAllAnalytics();
});
</script>
