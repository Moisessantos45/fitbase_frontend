<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Layers class="w-4 h-4" />
          </div>
          <h1 class="text-2xl font-bold text-white">Gestión de Planes</h1>
        </div>
        <p class="text-sm text-text-sub mt-1">
          Configura y administra el catálogo comercial de membresías y pases
        </p>
      </div>

      <div class="flex items-center gap-3">
        <span
          v-if="adminPlans.length > 0"
          class="px-3 py-1.5 rounded-full bg-surface-light text-xs font-bold text-primary"
        >
          {{ adminPlans.length }} Plan(es)
        </span>
        <NuxtLink
          v-if="adminPlans.length > 0"
          to="/admin/plans/create"
          class="btn-primary h-10! text-xs! px-4! flex items-center gap-1.5"
        >
          <Plus class="w-4 h-4" /> Nuevo Plan
        </NuxtLink>
      </div>
    </div>

    <div v-if="loading && adminPlans.length === 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div
        v-for="i in 3"
        :key="i"
        class="bg-surface border border-surface-light rounded-3xl p-6 space-y-4 animate-pulse"
      >
        <div class="h-6 bg-surface-light rounded-xl w-3/4"></div>
        <div class="h-4 bg-surface-light rounded-lg w-1/2"></div>
        <div class="h-12 bg-surface-light rounded-2xl w-full"></div>
      </div>
    </div>

    <div v-else-if="adminPlans.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div
        v-for="plan in adminPlans"
        :key="plan.id"
        class="bg-surface border border-surface-light hover:border-primary/40 rounded-3xl p-6 transition flex flex-col justify-between shadow-lg relative overflow-hidden"
      >
        <div class="space-y-4">
          <div class="flex items-start justify-between gap-3">
            <div>
              <span class="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-primary/10 text-primary border border-primary/20 mb-2">
                {{ plan.planType }}
              </span>
              <h3 class="text-lg font-bold text-white leading-tight">
                {{ plan.name }}
              </h3>
            </div>
            <span
              class="px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 flex items-center gap-1"
              :class="plan.active ? 'bg-primary/10 text-primary border border-primary/30' : 'bg-surface-light text-text-muted'"
            >
              <span class="w-1.5 h-1.5 rounded-full" :class="plan.active ? 'bg-primary' : 'bg-text-muted'"></span>
              {{ plan.active ? "Activo" : "Pausado" }}
            </span>
          </div>

          <p class="text-xs text-text-sub line-clamp-2 min-h-8">
            {{ plan.description }}
          </p>

          <div class="p-3.5 rounded-2xl bg-bg-base/70 border border-surface-light space-y-1">
            <div class="flex items-baseline gap-2">
              <span class="text-2xl font-black text-white tracking-tight">
                ${{ (plan.finalPrice ?? plan.price).toFixed(2) }}
              </span>
              <span v-if="plan.discount > 0" class="text-xs text-text-sub line-through">
                ${{ plan.price.toFixed(2) }}
              </span>
              <span class="text-xs text-text-sub">/ {{ plan.duration }} días</span>
            </div>
            <div class="flex items-center gap-2 text-[11px] text-text-muted">
              <span>Vigencia: {{ plan.duration }} días</span>
              <span v-if="plan.maxVisits">• Max: {{ plan.maxVisits }} visitas</span>
            </div>
          </div>

          <div v-if="plan.items && plan.items.length > 0" class="space-y-2 pt-2 border-t border-surface-light">
            <span class="text-[11px] font-bold text-text-sub uppercase tracking-wider block">
              Beneficios incluidos ({{ plan.items.length }})
            </span>
            <ul class="space-y-1.5 text-xs text-text-sub">
              <li
                v-for="item in plan.items.slice(0, 3)"
                :key="item.id"
                class="flex items-center gap-2 truncate"
              >
                <CheckCircle class="w-3.5 h-3.5 text-primary shrink-0" />
                <span class="truncate">{{ item.name }}</span>
              </li>
              <li v-if="plan.items.length > 3" class="text-[11px] text-primary font-semibold pl-5">
                +{{ plan.items.length - 3 }} más...
              </li>
            </ul>
          </div>
        </div>

        <div class="pt-5 mt-4 border-t border-surface-light flex items-center gap-2">
          <button
            type="button"
            @click="toggleActive(plan)"
            class="p-2.5 rounded-xl border border-surface-light hover:bg-surface-light text-text-sub hover:text-white transition cursor-pointer"
            :title="plan.active ? 'Pausar plan' : 'Activar plan'"
          >
            <Power class="w-4 h-4" :class="plan.active ? 'text-primary' : 'text-text-muted'" />
          </button>

          <NuxtLink
            :to="`/admin/plans/${plan.id}`"
            class="btn-secondary h-10! text-xs! flex-1 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Pencil class="w-3.5 h-3.5" /> Editar Plan
          </NuxtLink>
        </div>
      </div>
    </div>

    <div
      v-else
      class="bg-surface border border-surface-light rounded-3xl p-12 text-center space-y-4 max-w-lg mx-auto mt-8 shadow-xl"
    >
      <div class="w-16 h-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
        <Dumbbell class="w-8 h-8" />
      </div>
      <div>
        <h3 class="text-lg font-bold text-white">No hay planes creados</h3>
        <p class="text-xs text-text-sub mt-1 max-w-xs mx-auto">
          Comienza creando el primer plan de suscripción o pase diario para que tus socios puedan inscribirse.
        </p>
      </div>
      <NuxtLink
        to="/admin/plans/create"
        class="btn-primary h-11! text-xs! px-6! inline-flex items-center gap-2 cursor-pointer"
      >
        <Plus class="w-4 h-4" /> Crear Primer Plan
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
	CheckCircle,
	Dumbbell,
	Layers,
	Pencil,
	Plus,
	Power,
} from "lucide-vue-next";
import { useToast } from "vue-toastification";

definePageMeta({
	layout: "admin",
	requiresAuth: true,
	roles: [2, 3],
});

const toast = useToast();
const gymStore = useGymStore();
const planStore = usePlanStore();

const { gymForm } = storeToRefs(gymStore);
const { adminPlans, loading } = storeToRefs(planStore);

const toggleActive = async (plan: Plan) => {
	if (!plan.id) return;
	const res = await planStore.updatePlan(plan.id, {
		active: !plan.active,
	});
	if (res.isSuccess) {
		toast.success(
			!plan.active
				? "Plan activado correctamente"
				: "Plan pausado correctamente",
		);
		if (gymForm.value.id) {
			await planStore.getAllPlansByGym(gymForm.value.id);
		}
	} else {
		toast.error(res.getError?.msg || "Error al actualizar estado");
	}
};

onMounted(async () => {
	if (!gymForm.value.id) {
		await gymStore.getMyGym();
	}
	if (gymForm.value.id) {
		await planStore.getAllPlansByGym(gymForm.value.id);
	}
});
</script>
