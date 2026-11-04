<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <NuxtLink
          to="/admin/managers"
          class="inline-flex items-center gap-1.5 text-xs text-text-sub hover:text-white transition mb-2"
        >
          <ArrowLeft class="w-4 h-4" /> Volver a Encargados
        </NuxtLink>
        <h1 class="text-2xl font-bold text-white">Registrar Nuevo Encargado</h1>
        <p class="text-sm text-text-sub mt-1">
          Crea una cuenta con acceso administrativo para la gestión de sucursal
        </p>
      </div>

      <div
        class="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0"
      >
        <UserPlus class="w-6 h-6" />
      </div>
    </div>

    <div
      class="bg-surface border border-surface-light rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl"
    >
      <form @submit.prevent="handleSubmit" class="space-y-5">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <MoleculesInputField
            label="Nombre(s)"
            id="managerFirstName"
            required
            type="text"
            inputmode="text"
            v-model="form.firstName"
            placeholder="Ej. Valeria"
          />

          <MoleculesInputField
            label="Apellidos"
            id="managerLastName"
            required
            type="text"
            inputmode="text"
            v-model="form.lastName"
            placeholder="Ej. García"
          />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <MoleculesInputField
            label="Correo Electrónico"
            id="managerEmail"
            required
            type="email"
            inputmode="email"
            v-model="form.email"
            placeholder="encargado@fitbase.io"
          />

          <MoleculesInputField
            label="Teléfono de Contacto"
            id="managerPhone"
            required
            type="tel"
            inputmode="tel"
            v-model="form.phone"
            placeholder="+52 55 1234 5678"
          />
        </div>

        <MoleculesInputField
          label="Contraseña Temporal"
          id="managerPassword"
          required
          type="password"
          v-model="form.password"
          placeholder="Mínimo 8 caracteres"
        />

        <div
          class="p-4 rounded-2xl bg-bg-base/60 border border-surface-light text-xs text-text-sub flex items-start gap-3"
        >
          <ShieldAlert class="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <p>
            Al registrar al encargado, se le enviará un correo electrónico de
            confirmación con las instrucciones para verificar su cuenta y
            acceder al panel de control.
          </p>
        </div>

        <div
          class="pt-2 flex flex-col-reverse sm:flex-row sm:items-center justify-end gap-3"
        >
          <NuxtLink
            to="/admin/managers"
            class="btn-outlined h-11! text-xs! px-6! text-center"
          >
            Cancelar
          </NuxtLink>

          <button
            type="submit"
            :disabled="loading || isSubmitting"
            class="btn-primary h-11! text-xs! px-6! flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <UserPlus class="w-4 h-4" />
            <span>{{
              isSubmitting ? "Registrando..." : "Registrar Encargado"
            }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft, ShieldAlert, UserPlus } from "lucide-vue-next";
import { useToast } from "vue-toastification";

definePageMeta({
  name: "admin-managers-create",
  layout: "admin",
  requiresAuth: true,
  roles: [2],
});

const toast = useToast();
const managerStore = useManagerStore();
const { loading } = storeToRefs(managerStore);

const form = reactive<ManagerForm>(structuredClone(initialManagerForm));
const isSubmitting = ref(false);

const handleSubmit = async () => {
  if (
    !form.firstName.trim() ||
    !form.lastName.trim() ||
    !form.email.trim() ||
    !form.password.trim() ||
    !form.phone.trim()
  ) {
    toast.error("Por favor completa todos los campos requeridos");
    return;
  }

  if (form.password.length < 8) {
    toast.error("La contraseña debe tener al menos 8 caracteres");
    return;
  }

  isSubmitting.value = true;
  const res = await managerStore.createManager(form);
  isSubmitting.value = false;

  if (res.isSuccess) {
    toast.success("Encargado registrado correctamente");
    await navigateTo("/admin/managers");
  } else {
    toast.error(res.getError?.msg || "Error al registrar el encargado");
  }
};
</script>
