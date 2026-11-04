<template>
  <div class="min-h-[75vh] flex items-center justify-center p-4">
    <div
      class="w-full max-w-md bg-surface border border-surface-light rounded-3xl p-6 sm:p-8 space-y-6 text-center shadow-2xl relative overflow-hidden">
      <div v-if="loading" class="space-y-4 py-8">
        <div class="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto"></div>
        <div>
          <h2 class="text-lg font-bold text-white">Verificando tu pago...</h2>
          <p class="text-xs text-text-sub mt-1">Estamos validando la transacción con Stripe</p>
        </div>
      </div>

      <div v-else-if="isPaid" class="space-y-5">
        <div
          class="w-20 h-20 rounded-3xl bg-success/10 text-success flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 class="w-10 h-10" />
        </div>

        <div>
          <span
            class="text-[10px] uppercase font-bold text-success tracking-wider bg-success/10 px-3 py-1 rounded-full">
            ¡Pago Aprobado con Éxito!
          </span>
          <h1 class="text-2xl font-black text-white mt-2">¡Bienvenido a Fitbase!</h1>
          <p class="text-xs text-text-sub mt-1">
            {{ isGuest ? "Tu pase de acceso ha sido generado y confirmado." : "Tu suscripción ha sido activada correctamente en el sistema." }}
          </p>
        </div>

        <div v-if="sessionStatus"
          class="p-4 rounded-2xl bg-bg-base border border-surface-light text-left space-y-2 text-xs">
          <div class="flex justify-between items-center">
            <span class="text-text-sub">Folio de Pago:</span>
            <span class="font-bold text-white">#{{ sessionStatus.paymentId || paymentId }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-text-sub">Monto Pagado:</span>
            <span class="font-black text-primary text-sm">
              ${{ sessionStatus.amountTotal.toLocaleString("es-MX", { minimumFractionDigits: 2 }) }} {{
                sessionStatus.currency.toUpperCase() }}
            </span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-text-sub">Estado:</span>
            <span class="font-bold text-success capitalize">{{ sessionStatus.paymentStatus }}</span>
          </div>
        </div>

        <div class="pt-3 flex flex-col gap-2.5">
          <button
            v-if="ticketSlug"
            type="button"
            @click="viewTicket"
            class="btn-primary h-12! text-xs! w-full flex items-center justify-center gap-2 cursor-pointer shadow-lg"
          >
            <QrCode class="w-4 h-4" /> Ver y Descargar Mi Pase QR
          </button>
          <NuxtLink
            v-else-if="authenticated"
            to="/subscriptions"
            class="btn-primary h-12! text-xs! w-full flex items-center justify-center gap-2 cursor-pointer shadow-lg"
          >
            <QrCode class="w-4 h-4" /> Ver Mi Membresía y Acceso QR
          </NuxtLink>
          <NuxtLink
            to="/guest"
            class="btn-secondary h-11! text-xs! w-full flex items-center justify-center cursor-pointer"
          >
            Volver al Directorio de Sedes
          </NuxtLink>
        </div>
      </div>

      <div v-else class="space-y-5">
        <div class="w-20 h-20 rounded-3xl bg-warning/10 text-warning flex items-center justify-center mx-auto">
          <AlertCircle class="w-10 h-10" />
        </div>

        <div>
          <h2 class="text-lg font-bold text-white">Pago en Procesamiento</h2>
          <p class="text-xs text-text-sub mt-1">
            Tu pago está siendo confirmado por la pasarela bancaria. Se activará automáticamente en unos instantes.
          </p>
        </div>

        <NuxtLink
          to="/guest"
          class="btn-primary h-11! text-xs! w-full flex items-center justify-center cursor-pointer"
        >
          Volver a Inicio
        </NuxtLink>
      </div>
    </div>

    <FeaturesGuestTicketQrModal />
  </div>
</template>

<script setup lang="ts">
import { AlertCircle, CheckCircle2, QrCode } from "lucide-vue-next";

definePageMeta({
	name: "payment-success",
	layout: "default",
});

const route = useRoute();
const authStore = useAuthStore();
const paymentStore = usePaymentStore();
const daypassStore = useDayPassStore();

const { authenticated } = storeToRefs(authStore);
const { sessionStatus, loading } = storeToRefs(paymentStore);
const { currentTicket } = storeToRefs(daypassStore);

const sessionId = computed(() => (route.query.session_id as string) || "");
const paymentId = computed(() => (route.query.payment_id as string) || "");
const ticketSlug = computed(() => (route.query.slug as string) || "");

const isGuest = computed(
	() => !authenticated.value || Boolean(ticketSlug.value),
);

const isPaid = computed(() => {
	if (!sessionStatus.value) return true;
	return (
		sessionStatus.value.paymentStatus === "paid" ||
		sessionStatus.value.status === "complete"
	);
});

const viewTicket = async () => {
	if (ticketSlug.value) {
		await daypassStore.getTicketBySlug(ticketSlug.value);
		if (currentTicket.value) {
			daypassStore.openTicket();
		}
	}
};

onMounted(async () => {
	if (sessionId.value) {
		await paymentStore.getStripeSessionStatus(sessionId.value);
	}
	if (ticketSlug.value) {
		await daypassStore.getTicketBySlug(ticketSlug.value);
	}
});
</script>
