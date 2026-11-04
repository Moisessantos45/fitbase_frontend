<template>
  <div
    class="min-h-screen bg-bg-base text-white font-sans flex items-center justify-center p-4 sm:p-6 lg:p-8"
  >
    <div class="w-full max-w-110 mx-auto py-8">
      <div
        v-if="!loading"
        class="bg-surface border border-surface-light rounded-3xl p-8 text-center space-y-5"
      >
        <div
          class="w-14 h-14 bg-primary/10 text-primary rounded-2xl border border-primary/30 flex items-center justify-center mx-auto"
        >
          <CheckCircle2 class="w-7 h-7" />
        </div>

        <h1 class="text-2xl font-black text-white">Verifica tu cuenta</h1>

        <p class="text-xs text-text-sub leading-relaxed">
          Hemos enviado un correo de confirmación a tu dirección de email. Por
          favor, revisa tu bandeja de entrada y haz clic en el enlace de
          verificación para activar tu cuenta en Fitbase.
        </p>

        <div
          v-if="alertMessage.msg"
          class="p-3 rounded-xl text-xs font-semibold"
          :class="
            alertMessage.error
              ? 'bg-error/10 text-error'
              : 'bg-success/10 text-success'
          "
        >
          {{ alertMessage.msg }}
        </div>

        <div class="pt-4 border-t border-surface-light">
          <NuxtLink
            to="/login"
            class="btn-primary h-12! text-sm! inline-flex items-center justify-center gap-2"
          >
            <ArrowLeft class="w-4 h-4" />
            Volver al inicio de sesión
          </NuxtLink>
        </div>
      </div>

      <div
        v-else
        class="bg-surface border border-surface-light rounded-3xl p-8 text-center space-y-4"
      >
        <Loader2 class="w-10 h-10 text-primary animate-spin mx-auto" />
        <p class="text-sm font-semibold text-white">
          Verificando tu cuenta, por favor espera...
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CheckCircle2, ArrowLeft, Loader2 } from "lucide-vue-next";

definePageMeta({
  layout: "default",
});

const route = useRoute();
const authStore = useAuthStore();
const { alertMessage, loading } = storeToRefs(authStore);

watch(
  () => route.params.token,
  (newToken) => {
    if (typeof newToken === "string") {
      authStore.verifyAccount(newToken);
    }
  },
  { immediate: true },
);
</script>
