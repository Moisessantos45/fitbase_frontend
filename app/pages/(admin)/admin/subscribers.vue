<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white">Suscriptores</h1>
        <p class="text-sm text-text-sub mt-1">
          Control de socios, estados de membresía y renovaciones de la sede
        </p>
      </div>
      <span
        v-if="pagination.total > 0"
        class="px-3 py-1 rounded-full bg-surface-light text-xs font-bold text-primary"
      >
        {{ pagination.total }} Miembro(s)
      </span>
    </div>

    <div class="space-y-4">
      <div class="relative">
        <span class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-sub">
          <Search class="w-5 h-5" />
        </span>
        <input
          type="text"
          v-model="searchQuery"
          class="input-field pl-12"
          placeholder="Buscar suscriptor por nombre, email o plan..."
        />
      </div>

      <div class="flex flex-wrap gap-2">
        <button
          v-for="filter in statusFilters"
          :key="filter.label"
          type="button"
          @click="selectFilter(filter.id)"
          class="px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
          :class="
            activeStatusId === filter.id
              ? 'bg-primary text-on-primary'
              : 'bg-surface-light text-text-sub hover:text-white'
          "
        >
          {{ filter.label }}
        </button>
      </div>
    </div>

    <div v-if="loading && subscriptions.length === 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div
        v-for="i in 3"
        :key="i"
        class="bg-surface border border-surface-light rounded-3xl p-6 space-y-4 animate-pulse"
      >
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-2xl bg-surface-light"></div>
          <div class="space-y-2 flex-1">
            <div class="h-4 bg-surface-light rounded w-3/4"></div>
            <div class="h-3 bg-surface-light rounded w-1/2"></div>
          </div>
        </div>
        <div class="h-14 bg-surface-light rounded-2xl"></div>
      </div>
    </div>

    <div v-else-if="filteredSubscribers.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div
        v-for="sub in filteredSubscribers"
        :key="sub.id"
        class="bg-surface border border-surface-light hover:border-primary/40 rounded-3xl p-5 transition flex flex-col justify-between shadow-lg overflow-hidden"
      >
        <div class="space-y-4">
          <div class="flex items-start justify-between gap-2.5">
            <div class="flex items-center gap-3 min-w-0 flex-1">
              <div class="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                {{ getInitials(sub.userFullName) }}
              </div>
              <div class="min-w-0 flex-1">
                <h3 class="font-bold text-white text-sm truncate" :title="sub.userFullName">
                  {{ sub.userFullName || "Usuario sin nombre" }}
                </h3>
                <p class="text-xs text-text-sub truncate" :title="sub.userEmail">{{ sub.userEmail }}</p>
                <p v-if="sub.userPhone" class="text-[11px] text-text-muted mt-0.5 truncate">{{ sub.userPhone }}</p>
              </div>
            </div>
            <span
              class="px-2.5 py-1 rounded-md text-[10px] font-bold shrink-0 self-start"
              :class="{
                'bg-success/10 text-success border border-success/20': sub.statusName === 'Activo',
                'bg-warning/10 text-warning border border-warning/20': sub.statusName === 'Por Vencer' || sub.statusName === 'Pendiente',
                'bg-error/10 text-error border border-error/20': sub.statusName === 'Vencido' || sub.statusName === 'Inactivo',
              }"
            >
              {{ sub.statusName || "Activo" }}
            </span>
          </div>

          <div class="p-3.5 rounded-2xl bg-bg-base/70 border border-surface-light space-y-2">
            <div class="flex items-center justify-between text-xs gap-2">
              <span class="text-text-sub shrink-0">Plan:</span>
              <span class="font-bold text-primary truncate min-w-0 text-right">{{ sub.planName }}</span>
            </div>
            <div class="flex items-center justify-between text-xs">
              <span class="text-text-sub">Importe:</span>
              <span class="font-black text-white">${{ sub.planPrice.toFixed(2) }}</span>
            </div>
            <div class="flex items-center justify-between text-xs pt-1 border-t border-surface-light/60 gap-2">
              <span class="text-text-sub shrink-0">Vigencia:</span>
              <span class="text-[11px] font-semibold text-text-sub truncate text-right">
                {{ formatDate(sub.startDate) }} al {{ formatDate(sub.endDate) }}
              </span>
            </div>
          </div>
        </div>

        <div class="pt-4 mt-3 border-t border-surface-light flex items-center justify-between text-[11px] text-text-sub gap-2">
          <span v-if="sub.autoRenew" class="text-primary font-semibold flex items-center gap-1 shrink-0">
            • Renovación automática
          </span>
          <span v-else class="text-text-muted shrink-0">
            Pago único
          </span>
          <span v-if="sub.paymentMethodName" class="text-text-muted truncate text-right">
            {{ sub.paymentMethodName }}
          </span>
        </div>
      </div>
    </div>

    <div
      v-else
      class="bg-surface border border-surface-light rounded-3xl p-12 text-center space-y-3 max-w-md mx-auto shadow-xl"
    >
      <div class="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
        <Users class="w-7 h-7" />
      </div>
      <div>
        <h3 class="text-base font-bold text-white">No se encontraron suscriptores</h3>
        <p class="text-xs text-text-sub mt-1">
          {{
            searchQuery || activeStatusId
              ? "No hay resultados que coincidan con los filtros seleccionados."
              : "Aún no hay clientes con suscripciones activas en esta sede."
          }}
        </p>
      </div>
    </div>

    <div
      v-if="pagination.totalPages > 1"
      class="flex items-center justify-center gap-2 pt-4"
    >
      <button
        type="button"
        :disabled="pagination.page <= 1"
        @click="goToPage(pagination.page - 1)"
        class="btn-secondary h-9! text-xs! px-3! disabled:opacity-40 cursor-pointer"
      >
        Anterior
      </button>
      <span class="text-xs text-text-sub px-2">
        Página {{ pagination.page }} de {{ pagination.totalPages }}
      </span>
      <button
        type="button"
        :disabled="pagination.page >= pagination.totalPages"
        @click="goToPage(pagination.page + 1)"
        class="btn-secondary h-9! text-xs! px-3! disabled:opacity-40 cursor-pointer"
      >
        Siguiente
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search, Users } from "lucide-vue-next";

definePageMeta({
	layout: "admin",
	requiresAuth: true,
	roles: [2, 3],
});

const gymStore = useGymStore();
const subscriptionStore = useSubscriptionStore();

const { gymForm } = storeToRefs(gymStore);
const { subscriptions, pagination, loading } = storeToRefs(subscriptionStore);

const searchQuery = ref("");
const activeStatusId = ref<number | undefined>(undefined);

const statusFilters = [
	{ id: undefined, label: "Todos" },
	{ id: 1, label: "Activo" },
	{ id: 2, label: "Pendiente" },
	{ id: 3, label: "Inactivo" },
];

const getInitials = (name?: string): string => {
	if (!name) return "US";
	const parts = name.trim().split(" ");
	if (parts.length >= 2 && parts[0] && parts[1]) {
		return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
	}
	return name.substring(0, 2).toUpperCase();
};

const formatDate = (dateStr: string) => {
	if (!dateStr) return "";
	return new Date(dateStr).toLocaleDateString("es-MX", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	});
};

const selectFilter = async (statusId?: number) => {
	activeStatusId.value = statusId;
	if (gymForm.value.id) {
		await subscriptionStore.getSubscriptionsByGym(
			gymForm.value.id,
			statusId,
			1,
		);
	}
};

const goToPage = async (page: number) => {
	if (gymForm.value.id) {
		await subscriptionStore.getSubscriptionsByGym(
			gymForm.value.id,
			activeStatusId.value,
			page,
		);
	}
};

const filteredSubscribers = computed(() => {
	if (!searchQuery.value.trim()) {
		return subscriptions.value;
	}
	const q = searchQuery.value.toLowerCase().trim();
	return subscriptions.value.filter(
		(sub) =>
			sub.userFullName.toLowerCase().includes(q) ||
			sub.userEmail.toLowerCase().includes(q) ||
			sub.planName.toLowerCase().includes(q),
	);
});

onMounted(async () => {
	if (!gymForm.value.id) {
		await gymStore.getMyGym();
	}
	if (gymForm.value.id) {
		await subscriptionStore.getSubscriptionsByGym(gymForm.value.id);
	}
});
</script>
