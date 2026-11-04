<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <NuxtLink
          to="/admin/plans"
          class="inline-flex items-center gap-1.5 text-xs text-text-sub hover:text-white transition mb-2"
        >
          <ArrowLeft class="w-4 h-4" /> Volver a Planes
        </NuxtLink>
        <div class="flex items-center gap-3">
          <h1 class="text-2xl font-bold text-white">
            {{ planForm.name || "Editar Plan" }}
          </h1>
          <span
            class="px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 flex items-center gap-1"
            :class="planForm.active ? 'bg-primary/10 text-primary border border-primary/30' : 'bg-surface-light text-text-muted'"
          >
            <span class="w-1.5 h-1.5 rounded-full" :class="planForm.active ? 'bg-primary' : 'bg-text-muted'"></span>
            {{ planForm.active ? "Activo" : "Pausado" }}
          </span>
        </div>
        <p class="text-sm text-text-sub mt-1">
          Actualiza precios, vigencia y gestiona los beneficios individualmente
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          @click="toggleActive"
          class="btn-secondary h-10! text-xs! px-3.5! flex items-center gap-1.5 cursor-pointer"
        >
          <Power class="w-4 h-4" :class="planForm.active ? 'text-primary' : 'text-text-muted'" />
          {{ planForm.active ? "Pausar Plan" : "Activar Plan" }}
        </button>
      </div>
    </div>

    <form @submit.prevent="handleSaveGeneral" class="bg-surface border border-surface-light rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl">
      <div class="flex items-center justify-between border-b border-surface-light pb-3">
        <div>
          <h2 class="text-base font-bold text-white">Información Comercial</h2>
          <p class="text-xs text-text-sub mt-0.5">
            Configuración de tarifas, tipo de membresía y visibilidad
          </p>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="btn-primary h-10! text-xs! px-4! flex items-center gap-1.5 cursor-pointer"
        >
          <Save class="w-4 h-4" />
          {{ loading ? "Guardando..." : "Guardar Información" }}
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <MoleculesInputField
          id="edit-plan-name"
          label="Nombre del Plan"
          v-model="planForm.name"
          placeholder="Ej. Black Anual, Pase Libre"
          required
        />

        <div>
          <label class="block text-xs font-semibold text-text-sub uppercase tracking-wider mb-2">
            Tipo de Membresía
          </label>
          <AtomsDynamicDropdown
            :model-value="planForm.planType"
            @update:model-value="(val) => (planForm.planType = String(val))"
            :options="planTypeDropdownOptions"
            placeholder="Seleccionar frecuencia"
            class="w-full"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <MoleculesInputField
          id="edit-plan-duration"
          label="Duración (días)"
          type="number"
          inputmode="numeric"
          v-model="planForm.duration"
          required
        />

        <MoleculesInputField
          id="edit-plan-price"
          label="Precio Base ($)"
          type="number"
          inputmode="decimal"
          v-model="planForm.price"
          required
        />

        <MoleculesInputField
          id="edit-plan-discount"
          label="Descuento ($)"
          type="number"
          inputmode="decimal"
          v-model="planForm.discount"
        />

        <MoleculesInputField
          id="edit-plan-max-visits"
          label="Visitas Máx. (Opcional)"
          type="number"
          inputmode="numeric"
          v-model="planForm.maxVisits"
          placeholder="Ilimitadas"
        />
      </div>

      <MoleculesInputField
        id="edit-plan-desc"
        label="Descripción Detallada"
        v-model="planForm.description"
        placeholder="Acceso total a sala de pesas, cardio y casilleros estándar"
        required
      />

      <MoleculesInputField
        id="edit-plan-active-check"
        label="Plan Activo (disponible para contratación de clientes)"
        type="checkbox"
        v-model="planForm.active"
      />
    </form>

    <div class="bg-surface border border-surface-light rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
      <div class="flex items-center justify-between border-b border-surface-light pb-3">
        <div>
          <h2 class="text-base font-bold text-white flex items-center gap-2">
            <Sparkles class="w-4 h-4 text-primary" /> Beneficios del Plan
          </h2>
          <p class="text-xs text-text-sub mt-0.5">
            Cada beneficio se actualiza o elimina de forma directa en el servidor
          </p>
        </div>

        <span class="px-3 py-1 rounded-full bg-surface-light text-xs font-bold text-primary">
          {{ planDetail?.items?.length || 0 }} Registrado(s)
        </span>
      </div>

      <div v-if="planDetail?.items && planDetail.items.length > 0" class="space-y-3">
        <div
          v-for="item in planDetail.items"
          :key="item.id"
          class="p-4 rounded-2xl bg-bg-base/70 border border-surface-light flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
        >
          <div class="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MoleculesInputField
              :id="`edit-item-name-${item.id}`"
              label="Nombre del Beneficio"
              v-model="item.name"
              placeholder="Ej. Acceso 24/7"
              required
            />
            <MoleculesInputField
              :id="`edit-item-desc-${item.id}`"
              label="Detalle o Restricción"
              v-model="item.description"
              placeholder="Ej. Sin límite de horario"
            />
          </div>

          <div class="flex items-center gap-2 justify-end shrink-0 pt-2 sm:pt-0">
            <button
              type="button"
              @click="handleUpdateItem(item)"
              class="btn-secondary h-10! text-xs! px-3! flex items-center gap-1.5 cursor-pointer"
              title="Guardar cambios del beneficio"
            >
              <Save class="w-3.5 h-3.5" /> Guardar
            </button>
            <button
              type="button"
              @click="handleDeleteItem(item.id)"
              class="p-2.5 rounded-xl text-text-sub hover:text-error hover:bg-error/10 transition cursor-pointer"
              title="Eliminar beneficio"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <p v-else class="text-xs text-text-muted italic py-2 text-center">
        Este plan aún no tiene beneficios registrados.
      </p>

      <div class="p-5 rounded-2xl bg-surface-light/40 border border-surface-light space-y-4">
        <div>
          <h3 class="text-sm font-bold text-white flex items-center gap-2">
            <Plus class="w-4 h-4 text-primary" /> Agregar Nuevo Beneficio
          </h3>
          <p class="text-xs text-text-sub mt-0.5">
            El nuevo beneficio se agregará inmediatamente al plan
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <MoleculesInputField
            id="new-item-name"
            label="Nombre del Beneficio"
            v-model="itemForm.name"
            placeholder="Ej. Casillero VIP, Asesoría nutricional"
          />
          <MoleculesInputField
            id="new-item-desc"
            label="Detalle o Restricción (opcional)"
            v-model="itemForm.description"
            placeholder="Ej. Una sesión de valoración al mes"
          />
        </div>

        <div class="flex justify-end">
          <button
            type="button"
            :disabled="loading || !itemForm.name.trim()"
            @click="handleAddItem"
            class="btn-primary h-10! text-xs! px-5! flex items-center gap-1.5 cursor-pointer"
          >
            <Plus class="w-3.5 h-3.5" /> Agregar Beneficio
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
	ArrowLeft,
	Plus,
	Power,
	Save,
	Sparkles,
	Trash2,
} from "lucide-vue-next";
import { useToast } from "vue-toastification";

definePageMeta({
	layout: "admin",
	requiresAuth: true,
	roles: [2, 3],
});

const toast = useToast();
const route = useRoute();
const planStore = usePlanStore();
const gymStore = useGymStore();

const { gymForm } = storeToRefs(gymStore);
const { planForm, planDetail, itemForm, loading } = storeToRefs(planStore);

const planId = Number(route.params.id);

const planTypeDropdownOptions: DropdownOption[] = [
	{ id: "Mensual", label: "Mensual" },
	{ id: "Trimestral", label: "Trimestral" },
	{ id: "Semestral", label: "Semestral" },
	{ id: "Anual", label: "Anual" },
	{ id: "Semanal", label: "Semanal" },
	{ id: "Pase Diario", label: "Pase Diario" },
];

const handleSaveGeneral = async () => {
	if (!planId) return;
	const res = await planStore.updatePlan(planId);
	if (res.isSuccess) {
		toast.success("Información del plan actualizada correctamente");
		if (gymForm.value.id) {
			await planStore.getAllPlansByGym(gymForm.value.id);
		}
	} else {
		toast.error(res.getError?.msg || "Error al actualizar plan");
	}
};

const toggleActive = async () => {
	if (!planId) return;
	planForm.value.active = !planForm.value.active;
	const res = await planStore.updatePlan(planId);
	if (res.isSuccess) {
		toast.success(
			planForm.value.active
				? "Plan activado correctamente"
				: "Plan pausado correctamente",
		);
		if (gymForm.value.id) {
			await planStore.getAllPlansByGym(gymForm.value.id);
		}
	} else {
		toast.error(res.getError?.msg || "Error al cambiar estado del plan");
	}
};

const handleAddItem = async () => {
	if (!planId || !itemForm.value.name.trim()) return;
	const res = await planStore.addItem(planId);
	if (res.isSuccess) {
		toast.success("Beneficio agregado correctamente");
	} else {
		toast.error(res.getError?.msg || "Error al agregar beneficio");
	}
};

const handleUpdateItem = async (item: PlanItem) => {
	if (!planId || !item.id) return;
	const res = await planStore.updateItem(planId, item.id, {
		name: item.name,
		description: item.description,
	});
	if (res.isSuccess) {
		toast.success("Beneficio actualizado correctamente");
	} else {
		toast.error(res.getError?.msg || "Error al actualizar beneficio");
	}
};

const handleDeleteItem = async (itemId?: number) => {
	if (!planId || !itemId) return;
	const res = await planStore.deleteItem(planId, itemId);
	if (res.isSuccess) {
		toast.success("Beneficio eliminado correctamente");
	} else {
		toast.error(res.getError?.msg || "Error al eliminar beneficio");
	}
};

onMounted(async () => {
	if (!gymForm.value.id) {
		await gymStore.getMyGym();
	}
	if (planId) {
		await planStore.getPlanDetail(planId);
		planStore.resetItemForm();
	}
});
</script>
