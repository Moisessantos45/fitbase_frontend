<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-white">Mis Membresías</h1>
        <p class="text-sm text-text-sub mt-1">
          Gestiona tus planes activos, vigencias y credenciales de acceso QR
        </p>
      </div>

      <NuxtLink
        to="/map"
        class="btn-primary h-10! text-xs! px-4 flex items-center gap-2 cursor-pointer w-fit"
      >
        <Compass class="w-4 h-4" /> Explorar Sedes
      </NuxtLink>
    </div>

    <div v-if="loading && mySubscriptions.length === 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div v-for="i in 2" :key="i" class="bg-surface border border-surface-light rounded-3xl p-6 animate-pulse space-y-4">
        <div class="h-6 bg-surface-light rounded w-1/3"></div>
        <div class="h-4 bg-surface-light rounded w-2/3"></div>
        <div class="h-10 bg-surface-light rounded w-1/2 my-4"></div>
        <div class="h-12 bg-surface-light rounded-2xl w-full"></div>
      </div>
    </div>

    <div v-else-if="mySubscriptions.length > 0" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          v-for="sub in mySubscriptions"
          :key="sub.id"
          class="bg-surface border rounded-3xl p-6 relative flex flex-col justify-between hover:border-primary/50 transition shadow-xl"
          :class="sub.statusName === 'Activo' ? 'border-primary/60' : 'border-surface-light'"
        >
          <div
            v-if="sub.statusName === 'Activo'"
            class="absolute -top-3 right-6 bg-primary text-on-primary text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-wider flex items-center gap-1 shadow-md"
          >
            <CheckCircle class="w-3 h-3" /> ACTIVO
          </div>
          <div
            v-else
            class="absolute -top-3 right-6 bg-surface-light text-text-sub text-[10px] font-bold uppercase px-3 py-1 rounded-full tracking-wider border border-surface-light"
          >
            {{ sub.statusName }}
          </div>

          <div class="space-y-4">
            <div>
              <div class="flex items-center gap-1.5 text-xs font-semibold text-primary">
                <MapPin class="w-4 h-4" /> {{ sub.gymName }}
              </div>
              <h2 class="text-xl font-bold text-white mt-1">{{ sub.planName }}</h2>
            </div>

            <div class="flex items-baseline gap-2">
              <span class="text-2xl font-black text-white">
                ${{ sub.planPrice.toLocaleString("es-MX", { minimumFractionDigits: 2 }) }}
              </span>
              <span class="text-xs text-text-sub font-semibold">MXN</span>
            </div>

            <div class="space-y-2 py-3 border-t border-b border-surface-light">
              <div class="flex justify-between items-center text-xs">
                <span class="text-text-sub flex items-center gap-1.5">
                  <Calendar class="w-3.5 h-3.5 text-primary" /> Inicio de cobertura:
                </span>
                <span class="font-bold text-white">{{ formatDate(sub.startDate) }}</span>
              </div>
              <div class="flex justify-between items-center text-xs">
                <span class="text-text-sub flex items-center gap-1.5">
                  <Clock class="w-3.5 h-3.5 text-primary" /> Vence / Próximo corte:
                </span>
                <span class="font-bold" :class="sub.statusName === 'Activo' ? 'text-primary' : 'text-text-sub'">
                  {{ formatDate(sub.endDate) }}
                </span>
              </div>
            </div>

            <div class="flex items-center justify-between text-xs text-text-sub">
              <span class="flex items-center gap-1">
                {{ sub.autoRenew ? "• Renovación automática" : "• Pago único" }}
              </span>
              <span v-if="sub.paymentMethodName" class="text-text-muted">
                {{ sub.paymentMethodName }}
              </span>
            </div>
          </div>

          <div class="pt-5 mt-4 border-t border-surface-light flex flex-wrap gap-2.5">
            <button
              type="button"
              @click="openTicket(sub)"
              class="btn-primary h-11! text-xs! flex-1 flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <QrCode class="w-4 h-4" /> Mi Credencial QR
            </button>
            <button
              v-if="sub.statusName === 'Activo'"
              type="button"
              @click="openCancelModal(sub)"
              class="btn-secondary h-11! text-xs! px-3 text-red-400 hover:text-red-300 hover:border-red-500/40 flex items-center justify-center gap-1.5 cursor-pointer"
              title="Cancelar membresía"
            >
              <XCircle class="w-4 h-4" /> Cancelar
            </button>
            <NuxtLink
              to="/payments"
              class="btn-secondary h-11! text-xs! px-3 flex items-center justify-center cursor-pointer"
            >
              Recibos
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <div
      v-else
      class="bg-surface border border-surface-light rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-4 max-w-lg mx-auto shadow-2xl"
    >
      <div class="w-16 h-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center shadow-inner">
        <Dumbbell class="w-8 h-8" />
      </div>
      <div>
        <h3 class="text-lg font-bold text-white">No tienes membresías activas</h3>
        <p class="text-xs text-text-sub mt-2">
          Aún no cuentas con membresías ni pases contratados. Explora las sedes disponibles en Fitbase para unirte a un gimnasio.
        </p>
      </div>
      <NuxtLink
        to="/map"
        class="btn-primary h-11! text-xs! px-6 flex items-center gap-2 cursor-pointer mt-2"
      >
        <Compass class="w-4 h-4" /> Ver Sedes en el Mapa
      </NuxtLink>
    </div>

    <MoleculesBaseModal
      :hidden="showTicketModal"
      title="Credencial Digital de Acceso"
      width="440px"
      :hide-footer="true"
      @cancel="showTicketModal = false"
    >
      <div v-if="activeTicket" class="space-y-6 text-center py-2">
        <div>
          <span class="text-[10px] uppercase font-bold text-primary tracking-wider">
            {{ activeTicket.gymName }}
          </span>
          <h3 class="text-lg font-bold text-white mt-1">{{ activeTicket.planName }}</h3>
          <p class="text-xs text-text-sub mt-0.5">Vigente hasta el {{ formatDate(activeTicket.endDate) }}</p>
        </div>

        <div class="bg-white p-6 rounded-3xl inline-block shadow-2xl mx-auto border-4 border-primary">
          <img
            :src="`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${activeTicket.slug}`"
            :alt="activeTicket.slug"
            class="w-48 h-48 mx-auto"
          />
        </div>

        <div class="bg-bg-base border border-surface-light rounded-2xl p-3">
          <p class="text-[10px] text-text-muted uppercase font-bold tracking-wider">Código de Pase (Slug)</p>
          <p class="font-mono text-xs text-primary font-bold mt-1 break-all select-all">
            {{ activeTicket.slug }}
          </p>
        </div>

        <p class="text-[11px] text-text-sub">
          Muestra este código QR en el lector del mostrador o torniquete para ingresar a las instalaciones.
        </p>

        <div class="flex gap-2">
          <button
            type="button"
            :disabled="downloading"
            @click="
              downloadCredentialCard({
                gymName: activeTicket.gymName,
                planName: activeTicket.planName,
                slug: activeTicket.slug,
                endDate: formatDate(activeTicket.endDate),
                memberName: activeTicket.userFullName,
              })
            "
            class="btn-primary h-11! text-xs! flex-1 flex items-center justify-center gap-2 cursor-pointer shadow-lg"
          >
            <Download class="w-4 h-4" />
            {{ downloading ? "Generando..." : "Descargar Imagen QR" }}
          </button>
          <button
            type="button"
            @click="showTicketModal = false"
            class="btn-secondary h-11! text-xs! px-4 cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </MoleculesBaseModal>

    <MoleculesBaseModal
      :hidden="showCancelModal"
      title="Cancelar Suscripción"
      width="440px"
      :hide-footer="true"
      @cancel="showCancelModal = false"
    >
      <div v-if="subscriptionToCancel" class="space-y-4 text-center py-2">
        <div class="w-12 h-12 rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center mx-auto">
          <AlertTriangle class="w-6 h-6" />
        </div>

        <div>
          <h3 class="text-base font-bold text-white">¿Confirmas la cancelación?</h3>
          <p class="text-xs text-text-sub mt-2">
            Tu membresía en <strong>{{ subscriptionToCancel.planName }}</strong> ({{ subscriptionToCancel.gymName }}) quedará cancelada. Se detendrá cualquier cobro recurrente.
          </p>
        </div>

        <div class="pt-2 flex gap-3">
          <button
            type="button"
            :disabled="processingCancel"
            @click="showCancelModal = false"
            class="btn-secondary h-11! text-xs! flex-1 cursor-pointer"
          >
            Volver
          </button>
          <button
            type="button"
            :disabled="processingCancel"
            @click="handleCancelSubscription"
            class="btn-primary h-11! text-xs! flex-1 bg-red-600! hover:bg-red-500! text-white! flex items-center justify-center gap-2 cursor-pointer shadow-lg"
          >
            {{ processingCancel ? "Cancelando..." : "Confirmar Cancelación" }}
          </button>
        </div>
      </div>
    </MoleculesBaseModal>
  </div>
</template>

<script setup lang="ts">
import {
	AlertTriangle,
	Calendar,
	CheckCircle,
	Clock,
	Compass,
	Download,
	Dumbbell,
	MapPin,
	QrCode,
	XCircle,
} from "lucide-vue-next";
import { useToast } from "vue-toastification";

definePageMeta({
	name: "user-subscriptions",
	layout: "user",
	requiresAuth: true,
	roles: [4],
});

const toast = useToast();
const subscriptionStore = useSubscriptionStore();
const { mySubscriptions, loading } = storeToRefs(subscriptionStore);
const { downloading, downloadCredentialCard } = useCredentialDownload();

const activeTicket = ref<SubscriptionItem | null>(null);
const showTicketModal = ref(false);
const showCancelModal = ref(false);
const subscriptionToCancel = ref<SubscriptionItem | null>(null);
const processingCancel = ref(false);

const formatDate = (dateStr: string) => {
	if (!dateStr) return "";
	return new Date(dateStr).toLocaleDateString("es-MX", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
};

const openTicket = (sub: SubscriptionItem) => {
	activeTicket.value = sub;
	showTicketModal.value = true;
};

const openCancelModal = (sub: SubscriptionItem) => {
	subscriptionToCancel.value = sub;
	showCancelModal.value = true;
};

const handleCancelSubscription = async () => {
	if (!subscriptionToCancel.value?.id) return;

	processingCancel.value = true;
	try {
		const res = await subscriptionStore.cancelSubscription(
			subscriptionToCancel.value.id,
		);
		if (res.isSuccess) {
			toast.success(res.getMessage || "Suscripción cancelada exitosamente");
			showCancelModal.value = false;
			await subscriptionStore.getMySubscriptions(1, 50);
		} else {
			toast.error(res.getError?.msg || "No se pudo cancelar la suscripción");
		}
	} catch (_) {
		toast.error("Ocurrió un error al cancelar la suscripción");
	} finally {
		processingCancel.value = false;
	}
};

onMounted(async () => {
	await subscriptionStore.getMySubscriptions(1, 50);
});
</script>
