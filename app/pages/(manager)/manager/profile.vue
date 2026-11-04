<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white">Perfil de Usuario</h1>
        <p class="text-sm text-text-sub mt-1">
          Información de cuenta y métricas de desempeño
        </p>
      </div>
    </div>

    <div
      class="flex flex-col items-center p-6 bg-surface border border-surface-light rounded-3xl"
    >
      <div class="relative">
        <div
          class="w-24 h-24 rounded-full bg-surface-light border-2 border-primary flex items-center justify-center text-white"
        >
          <User v-if="!managerForm.avatarURL.trim()" class="w-12 h-12" />
          <img
            v-else
            :src="managerForm.avatarURL"
            alt="Avatar"
            class="w-20 h-20 rounded-full object-cover"
          />
        </div>
        <label
          class="absolute bottom-0 right-0 p-2 rounded-full bg-primary text-on-primary shadow-md transition cursor-pointer"
          :class="{
            'opacity-50 pointer-events-none cursor-not-allowed':
              uploadingAvatar || managerForm?.id === undefined,
            'hover:scale-110':
              !uploadingAvatar && managerForm?.id !== undefined,
          }"
          :title="
            managerForm?.id === undefined
              ? 'Completa tu perfil para subir una foto'
              : 'Cambiar foto de perfil'
          "
        >
          <Camera class="w-4 h-4" />
          <input
            type="file"
            accept="image/*"
            class="hidden"
            :disabled="uploadingAvatar || managerForm?.id === undefined"
            @change="handleAvatarChange"
          />
        </label>
      </div>

      <h2 class="text-xl font-bold text-white mt-4">
        {{ managerForm?.firstName || "Nombre no disponible" }}
        {{ managerForm?.lastName || "Apellido no disponible" }}
      </h2>
      <p class="text-xs text-text-sub">
        {{ authData?.email || "Correo electrónico no disponible" }}
      </p>
      <span
        class="mt-2 px-3 py-1 rounded-full text-[11px] font-bold bg-surface-light text-primary border border-primary/30"
      >
        {{ roleName }}
      </span>

      <div
        class="grid grid-cols-3 gap-3 w-full mt-6 pt-6 border-t border-surface-light text-center"
      >
        <div>
          <p class="text-xl font-black text-white">32</p>
          <p class="text-[11px] text-text-sub mt-0.5">Visitas Mes</p>
        </div>
        <div>
          <p class="text-xl font-black text-primary">14</p>
          <p class="text-[11px] text-text-sub mt-0.5">Días Racha</p>
        </div>
        <div>
          <p class="text-xl font-black text-white">74.5</p>
          <p class="text-[11px] text-text-sub mt-0.5">Peso (kg)</p>
        </div>
      </div>
    </div>

    <form
      @submit.prevent="handleClick"
      class="bg-surface border border-surface-light rounded-3xl p-6 space-y-4"
    >
      <h2 class="text-sm font-bold text-white mb-2">Datos Personales</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <MoleculesInputField
          label="Nombre"
          id="name"
          required
          type="text"
          inputmode="text"
          v-model="managerForm.firstName"
          placeholder="Carlos"
        />

        <MoleculesInputField
          label="Apellido"
          id="lastName"
          required
          type="text"
          inputmode="text"
          v-model="managerForm.lastName"
          placeholder="Mendoza"
        />
        <MoleculesInputField
          label="Numero de Telefono"
          id="phone"
          required
          type="tel"
          inputmode="tel"
          v-model="managerForm.phone"
          placeholder="(123) 456-7890"
        />
      </div>

      <div class="pt-4 flex justify-end">
        <button
          type="submit"
          class="btn-primary sm:w-48! h-12! text-xs!"
          :disabled="loading"
        >
          Guardar Cambios
        </button>
      </div>
    </form>

    <form
      @submit.prevent="handleUpdatePassword"
      class="bg-surface border border-surface-light rounded-3xl p-6 space-y-4"
    >
      <h2 class="text-sm font-bold text-white mb-2">Cambiar Contraseña</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <MoleculesInputField
          label="Contraseña Actual"
          id="currentPassword"
          required
          type="password"
          inputmode="text"
          v-model="currentPassword"
          placeholder="Ingresa tu contraseña actual"
        />

        <MoleculesInputField
          label="Nueva Contraseña"
          id="newPassword"
          required
          type="password"
          inputmode="text"
          v-model="newPassword"
          placeholder="Ingresa tu nueva contraseña"
        />
      </div>

      <div class="pt-4 flex justify-end">
        <button
          type="submit"
          class="btn-primary sm:w-48! h-12! text-xs!"
          :disabled="passwordLoading"
        >
          Cambiar Contraseña
        </button>
      </div>
    </form>

    <div
      v-if="savedSuccess"
      class="fixed bottom-6 right-6 z-50 bg-success text-on-primary px-4 py-2 rounded-xl text-xs font-bold shadow-lg"
    >
      Perfil guardado correctamente
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from "vue-toastification";
import { User, Camera } from "lucide-vue-next";

definePageMeta({
  layout: "admin",
  requiresAuth: true,
  roles: [3],
});

const showPhotoModal = ref(false);
const savedSuccess = ref(false);

const toast = useToast();
const userStore = useManagerStore();
const authStore = useAuthStore();
const { managerForm, loading } = storeToRefs(userStore);
const { authData } = storeToRefs(authStore);

const currentPassword = ref("");
const newPassword = ref("");
const passwordLoading = ref(false);
const uploadingAvatar = ref(false);

const roleName = computed(() => {
  return authData.value.roleId === 1
    ? "Administrador"
    : authData.value.roleId === 2
      ? "Dueño de Gimnasio"
      : authData.value.roleId === 3
        ? "Encargado de Gimnasio"
        : "Rol desconocido";
});

const handleAvatarChange = async (event: Event) => {
  if (!(event.target instanceof HTMLInputElement)) return;
  const target = event.target;
  const file = target.files?.[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    toast.error("Por favor, selecciona un archivo de imagen válido.");
    return;
  }

  const maxSize = 2 * 1024 * 1024;
  if (file.size > maxSize) {
    toast.error("La imagen no debe superar los 2MB.");
    return;
  }

  uploadingAvatar.value = true;
  const result = await userStore.uploadAvatar(file);
  uploadingAvatar.value = false;

  if (result.isSuccess) {
    toast.success("Avatar actualizado correctamente.");
  } else {
    toast.error(result.getError?.msg || "Error al subir el avatar.");
  }
};

const handleClick = async () => {
  const result = await userStore.update();
  if (result.isSuccess) {
    toast.success("Información del usuario actualizada correctamente.");
  } else {
    toast.error(
      result.getError?.msg ||
        "Error al actualizar la información del organizador.",
    );
  }
};

const handleUpdatePassword = async () => {
  if (!currentPassword.value.trim() || !newPassword.value.trim()) {
    toast.error("Debes completar la contraseña actual y la nueva contraseña.");
    return;
  }

  passwordLoading.value = true;
  const result = await authStore.updatePassword(
    currentPassword.value,
    newPassword.value,
  );
  passwordLoading.value = false;

  if (result.isSuccess) {
    toast.success("Contraseña actualizada correctamente.");
    currentPassword.value = "";
    newPassword.value = "";
  } else {
    toast.error(result.getError?.msg || "No se pudo actualizar la contraseña.");
  }
};
</script>
