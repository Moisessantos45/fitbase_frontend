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
        <h1 class="text-2xl font-bold text-white">Crear Nuevo Plan</h1>
        <p class="text-sm text-text-sub mt-1">
          Define el costo, vigencia y beneficios de la membresía o pase
        </p>
      </div>

      <div class="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
        <Sparkles class="w-6 h-6" />
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="bg-surface border border-surface-light rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl">
        <h2 class="text-base font-bold text-white border-b border-surface-light pb-3">
          Información Comercial
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <MoleculesInputField
            id="create-plan-name"
            label="Nombre del Plan"
            v-model="planForm.name"
            placeholder="Ej. Black Anual, Pase Libre, Estudiante"
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
            id="create-plan-duration"
            label="Duración (días)"
            type="number"
            inputmode="numeric"
            v-model="planForm.duration"
            required
          />

          <MoleculesInputField
            id="create-plan-price"
            label="Precio Base ($)"
            type="number"
            inputmode="decimal"
            v-model="planForm.price"
            required
          />

          <MoleculesInputField
            id="create-plan-discount"
            label="Descuento ($)"
            type="number"
            inputmode="decimal"
            v-model="planForm.discount"
          />

          <MoleculesInputField
            id="create-plan-max-visits"
            label="Visitas Máx. (Opcional)"
            type="number"
            inputmode="numeric"
            v-model="planForm.maxVisits"
            placeholder="Ilimitadas"
          />
        </div>

        <MoleculesInputField
          id="create-plan-desc"
          label="Descripción Detallada"
          v-model="planForm.description"
          placeholder="Acceso total a sala de pesas, cardio, regaderas y casilleros estándar"
          required
        />
      </div>

      <div class="bg-surface border border-surface-light rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl">
        <div class="flex items-center justify-between border-b border-surface-light pb-3">
          <div>
            <h2 class="text-base font-bold text-white flex items-center gap-2">
              <Sparkles class="w-4 h-4 text-primary" /> Beneficios Incluidos
            </h2>
            <p class="text-xs text-text-sub mt-0.5">
              Servicios que el usuario tendrá derecho al adquirir este plan
            </p>
          </div>

          <button
            type="button"
            @click="addBenefit"
            class="btn-secondary h-9! text-xs! px-3! flex items-center gap-1.5 cursor-pointer"
          >
            <Plus class="w-3.5 h-3.5" /> Agregar Beneficio
          </button>
        </div>

        <div class="space-y-3">
          <div
            v-for="(item, idx) in planForm.items"
            :key="idx"
            class="p-4 rounded-2xl bg-bg-base/70 border border-surface-light flex items-start gap-3"
          >
            <div class="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <MoleculesInputField
                :id="`item-name-${idx}`"
                label="Nombre del Beneficio"
                v-model="item.name"
                placeholder="Ej. Acceso a todas las clases"
                required
              />
              <MoleculesInputField
                :id="`item-desc-${idx}`"
                label="Detalle o Restricción (opcional)"
                v-model="item.description"
                placeholder="Ej. Previa reserva en la app"
              />
            </div>
            <button
              type="button"
              @click="removeBenefit(idx)"
              class="p-2.5 rounded-xl text-text-sub hover:text-error hover:bg-error/10 transition self-center cursor-pointer"
              title="Eliminar beneficio"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>

          <p v-if="planForm.items.length === 0" class="text-xs text-text-muted italic py-3 text-center">
            No has agregado beneficios aún. Haz clic en "Agregar Beneficio" para incluir servicios al plan.
          </p>
        </div>
      </div>

      <div class="flex items-center justify-end gap-3 pt-2">
        <NuxtLink
          to="/admin/plans"
          class="btn-secondary h-11! text-xs! px-6! flex items-center justify-center"
        >
          Cancelar
        </NuxtLink>
        <button
          type="submit"
          :disabled="loading"
          class="btn-primary h-11! text-xs! px-8! flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus class="w-4 h-4" />
          {{ loading ? "Guardando..." : "Crear y Publicar Plan" }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft, Plus, Sparkles, Trash2 } from "lucide-vue-next";
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
const { planForm, loading } = storeToRefs(planStore);

const planTypeDropdownOptions: DropdownOption[] = [
	{ id: "Mensual", label: "Mensual" },
	{ id: "Trimestral", label: "Trimestral" },
	{ id: "Semestral", label: "Semestral" },
	{ id: "Anual", label: "Anual" },
	{ id: "Semanal", label: "Semanal" },
	{ id: "Pase Diario", label: "Pase Diario" },
];

const addBenefit = () => {
	planForm.value.items.push({ name: "", description: "" });
};

const removeBenefit = (index: number) => {
	planForm.value.items.splice(index, 1);
};

const handleSubmit = async () => {
	if (!planForm.value.gymId) {
		planForm.value.gymId = gymForm.value.id || 0;
	}
	const res = await planStore.createPlan();
	if (res.isSuccess) {
		toast.success("Plan creado y publicado correctamente");
		await navigateTo("/admin/plans");
	} else {
		toast.error(res.getError?.msg || "Error al crear el plan");
	}
};

onMounted(async () => {
	if (!gymForm.value.id) {
		await gymStore.getMyGym();
	}
	planStore.resetPlanForm(gymForm.value.id || 0);
});
</script>
