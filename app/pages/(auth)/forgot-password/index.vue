<template>
  <div
    class="min-h-screen bg-bg-base text-white font-sans flex items-center justify-center p-4 sm:p-6 lg:p-8"
  >
    <div class="w-full max-w-110 mx-auto py-8">
      <div class="flex items-center justify-between mb-6">
        <NuxtLink
          to="/login"
          class="w-10 h-10 rounded-2xl bg-surface border border-surface-light flex items-center justify-center text-white hover:text-primary transition"
        >
          <ArrowLeft class="w-5 h-5" />
        </NuxtLink>
        <span class="text-xs font-bold tracking-widest text-primary uppercase"
          >RECUPERACIÓN</span
        >
        <div class="w-10"></div>
      </div>

      <div class="flex flex-col items-center mb-8">
        <div
          class="w-18 h-18 bg-surface rounded-[22px] border-2 border-primary flex items-center justify-center shadow-lg shadow-primary/10 mb-4"
        >
          <Mail class="w-9 h-9 text-primary" />
        </div>
        <h1 class="text-2xl font-black text-white">Recuperar Contraseña</h1>
        <p class="text-sm text-text-sub mt-1 text-center">
          Ingresa tu correo registrado y te enviaremos instrucciones para
          restablecer tu cuenta.
        </p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <MoleculesInputField
          label="Correo electrónico"
          id="email"
          required
          type="email"
          inputmode="email"
          v-model="email"
          placeholder="admin@cotizaerp.com"
        />

        <div class="pt-2">
          <button type="submit" class="btn-primary">
            <span>Verificar Correo</span>
          </button>
        </div>

        <div class="text-center pt-4">
          <NuxtLink
            to="/login"
            class="text-xs font-semibold text-text-sub hover:text-primary transition inline-flex items-center gap-1.5"
          >
            <ArrowLeft class="w-4 h-4" />
            Volver al inicio de sesión
          </NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from "vue-toastification";
import { Mail, ArrowLeft } from "lucide-vue-next";

definePageMeta({
  layout: "default",
});

const toast = useToast();
const authStore = useAuthStore();
const email = ref("");

const handleSubmit = async () => {
  const result = await authStore.forgotPassword(email.value);
  if (result.isSuccess) {
    toast.success(
      result.getMessage || "Correo de recuperación enviado exitosamente.",
    );
  } else {
    toast.error(
      result.getError?.msg || "Error al enviar el correo de recuperación.",
    );
  }
};
</script>
