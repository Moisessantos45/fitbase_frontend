<template>
  <div class="min-h-[75vh] flex items-center justify-center p-4">
    <div
      class="w-full max-w-md bg-surface border border-surface-light rounded-3xl p-6 sm:p-8 space-y-6 text-center shadow-2xl relative overflow-hidden">
      <div
        class="w-20 h-20 rounded-3xl bg-warning/10 text-warning flex items-center justify-center mx-auto shadow-inner">
        <XCircle class="w-10 h-10" />
      </div>

      <div>
        <span class="text-[10px] uppercase font-bold text-warning tracking-wider bg-warning/10 px-3 py-1 rounded-full">
          Transacción Cancelada
        </span>
        <h1 class="text-2xl font-black text-white mt-2">Pago no completado</h1>
        <p class="text-xs text-text-sub mt-1 leading-relaxed">
          Has cancelado el proceso de pago en Stripe o retrocediste antes de confirmar. No se realizó ningún cargo a tu
          tarjeta.
        </p>
      </div>

      <div v-if="paymentId" class="p-4 rounded-2xl bg-bg-base border border-surface-light text-left space-y-2 text-xs">
        <div class="flex justify-between items-center">
          <span class="text-text-sub">Referencia de intento:</span>
          <span class="font-bold text-white">#{{ paymentId }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-text-sub">Estado:</span>
          <span class="font-bold text-warning">Cancelado por el usuario</span>
        </div>
      </div>

      <div class="pt-2 flex flex-col gap-2.5">
        <NuxtLink to="/guest"
          class="btn-primary h-12! text-xs! w-full flex items-center justify-center gap-2 cursor-pointer shadow-lg">
          <RotateCcw class="w-4 h-4" /> Intentar de nuevo en Modo Invitado
        </NuxtLink>
        <NuxtLink v-if="authenticated" to="/subscriptions"
          class="btn-secondary h-11! text-xs! w-full flex items-center justify-center cursor-pointer">
          Ver Mis Membresías
        </NuxtLink>
        <NuxtLink v-else to="/login"
          class="btn-secondary h-11! text-xs! w-full flex items-center justify-center cursor-pointer text-text-sub hover:text-white">
          Iniciar Sesión
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RotateCcw, XCircle } from "lucide-vue-next";

definePageMeta({
  name: "payment-cancel",
  layout: "default",
});

const route = useRoute();
const authStore = useAuthStore();
const { authenticated } = storeToRefs(authStore);

const paymentId = computed(() => (route.query.payment_id) || "");
</script>
