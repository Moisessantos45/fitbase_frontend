<template>
  <div class="min-h-[80vh] flex items-center justify-center p-4">
    <div class="w-full max-w-md bg-surface border border-surface-light rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
      <div class="text-center space-y-3">
        <div class="w-16 h-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-inner">
          <Banknote class="w-8 h-8" />
        </div>
        <div>
          <h1 class="text-xl font-bold text-white">Apertura de Turno de Caja</h1>
          <p class="text-xs text-text-sub mt-1">
            Ingresa el fondo inicial en efectivo para habilitar el turno operativo
          </p>
        </div>

        <div v-if="gymForm.name" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-light text-xs font-semibold text-primary">
          {{ gymForm.name }}
        </div>
      </div>

      <form @submit.prevent="handleOpenRegister" class="space-y-5">
        <MoleculesInputField
          id="open-cash"
          label="Fondo Inicial en Efectivo ($)"
          type="number"
          inputmode="decimal"
          v-model="openCash"
          placeholder="500.00"
          required
        />

        <button
          type="submit"
          :disabled="loading || openCash < 0"
          class="btn-primary h-11! text-xs! w-full flex items-center justify-center gap-2 cursor-pointer shadow-lg"
        >
          <LockOpen class="w-4 h-4" />
          {{ loading ? "Abriendo caja..." : "Abrir Turno de Caja" }}
        </button>
      </form>

      <div class="text-center">
        <p class="text-[11px] text-text-muted">
          Este registro es obligatorio para registrar cobros en mostrador y validar accesos.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Banknote, LockOpen } from "lucide-vue-next";
import { useToast } from "vue-toastification";

definePageMeta({
	layout: "admin",
	requiresAuth: true,
	roles: [3],
});

const toast = useToast();
const gymStore = useGymStore();
const cashRegisterStore = useCashRegisterStore();

const { gymForm } = storeToRefs(gymStore);
const { loading } = storeToRefs(cashRegisterStore);

const openCash = ref<number>(500);

const handleOpenRegister = async () => {
	if (!gymForm.value.id) {
		await gymStore.getMyGym();
	}
	if (!gymForm.value.id) {
		toast.error("No se encontró la sede asignada para este encargado.");
		return;
	}

	const res = await cashRegisterStore.openRegister({
		gymId: gymForm.value.id,
		openCash: Number(openCash.value),
	});

	if (res.isSuccess) {
		toast.success("Turno de caja abierto exitosamente.");
		await navigateTo("/admin");
	} else {
		toast.error(
			res.getError?.msg ||
				"Error al abrir la caja. Verifica que no haya otro turno activo.",
		);
	}
};

onMounted(async () => {
	if (!gymForm.value.id) {
		await gymStore.getMyGym();
	}
	const current = await cashRegisterStore.getCurrentRegister();
	if (current.isSuccess && cashRegisterStore.currentRegister?.isOpen) {
		await navigateTo("/admin");
	}
});
</script>
