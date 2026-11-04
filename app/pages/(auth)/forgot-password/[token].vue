<template>
  <div
    class="min-h-screen bg-bg-base text-white font-sans flex items-center justify-center p-4 sm:p-6 lg:p-8"
  >
    <div class="w-full max-w-110 mx-auto py-8">
      <div class="flex flex-col items-center mb-8">
        <div
          class="w-18 h-18 bg-surface rounded-[22px] border-2 border-primary flex items-center justify-center shadow-lg shadow-primary/10 mb-4"
        >
          <LockKeyhole class="w-9 h-9 text-primary" />
        </div>
        <h1 class="text-2xl font-black text-white">Cambiar Contraseña</h1>
        <p class="text-sm text-text-sub mt-1 text-center">
          Ingresa tu nueva clave de acceso para asegurar tu cuenta.
        </p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <MoleculesInputField
          label="Contraseña"
          id="password"
          required
          type="password"
          inputmode="text"
          v-model="newPassword"
          placeholder="••••••••"
        />

        <div>
          <label class="block text-sm font-semibold text-text-sub mb-1.5"
            >Confirmar Contraseña</label
          >
          <div class="relative">
            <span
              class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-sub"
            >
              <Lock class="w-5 h-5" />
            </span>
            <input
              type="password"
              v-model="confirmPassword"
              class="input-field pl-12"
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        <div
          class="bg-surface rounded-2xl border border-surface-light p-4 space-y-2"
        >
          <p class="text-xs font-semibold text-white uppercase tracking-wider">
            Requisitos de seguridad
          </p>
          <ul class="space-y-1.5">
            <li
              v-for="req in requirements"
              :key="req.label"
              class="flex items-center gap-2 text-xs text-text-sub font-medium"
            >
              <Check class="h-4 w-4 text-primary shrink-0" v-if="req.met" />
              <span
                class="w-1.5 h-1.5 rounded-full bg-text-muted shrink-0 ml-1.5 mr-1"
                v-else
              ></span>
              {{ req.label }}
            </li>
          </ul>
        </div>

        <div class="space-y-3 pt-2">
          <button
            type="submit"
            :disabled="loading"
            class="btn-primary"
            :class="{ 'opacity-70 cursor-not-allowed': loading }"
          >
            <span>Actualizar Contraseña</span>
          </button>

          <NuxtLink to="/login" class="btn-secondary h-12! text-sm!">
            Volver al inicio de sesión
          </NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from "vue-toastification";
import { LockKeyhole, Lock, Eye, EyeOff, Check } from "lucide-vue-next";

definePageMeta({
  layout: "default",
});

const toast = useToast();
const route = useRoute();
const newPassword = ref("");
const confirmPassword = ref("");

const authStore = useAuthStore();
const { loading } = storeToRefs(authStore);

const setToast = (message: string, isError = false) => {
  if (isError) {
    toast.error(message);
  } else {
    toast.success(message);
  }
};

const requirements = computed(() => [
  { label: "Mínimo 8 caracteres", met: newPassword.value.length >= 8 },
  { label: "Al menos un número", met: /\d/.test(newPassword.value) },
  { label: "Una letra mayúscula", met: /[A-Z]/.test(newPassword.value) },
  {
    label: "Un carácter especial (@, #, $)",
    met: /[@#$%^&*!]/.test(newPassword.value),
  },
]);

const handleSubmit = async () => {
  if (newPassword.value !== confirmPassword.value) {
    setToast("Las contraseñas no coinciden.", true);
    return;
  }

  const token = route.params.token ?? "";
  if (token.toString().length === 0 || !token || typeof token !== "string") {
    setToast("Token de recuperación no válido.", true);
    return;
  }

  const result = await authStore.resetPassword(token, newPassword.value);
  if (result.isSuccess) {
    setToast(result.getMessage || "Contraseña actualizada exitosamente.");
  } else {
    setToast(
      result.getError?.msg || "Error al actualizar la contraseña.",
      true,
    );
  }
};
</script>
