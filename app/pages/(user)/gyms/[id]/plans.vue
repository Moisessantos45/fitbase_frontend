<template>
  <div class="space-y-6">
    <div class="flex items-center gap-3">
      <NuxtLink
        to="/map"
        class="w-10 h-10 rounded-xl bg-surface border border-surface-light flex items-center justify-center text-text-sub hover:text-white transition cursor-pointer"
      >
        <ArrowLeft class="w-4 h-4" />
      </NuxtLink>
      <div>
        <h1 class="text-2xl font-bold text-white">Planes y Membresías</h1>
        <p class="text-xs font-semibold text-primary mt-0.5">
          {{ gymDetail?.name || enrollmentData?.gymName || "Cargando gimnasio..." }}
        </p>
      </div>
    </div>

    <div
      v-if="hasActiveSubscription && activeSubscription"
      class="gradient-card-lime rounded-3xl p-6 border border-primary/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
    >
      <div class="flex items-start gap-4">
        <div
          class="w-12 h-12 rounded-2xl bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-md"
        >
          <BadgeCheck class="w-6 h-6" />
        </div>
        <div>
          <div class="flex items-center gap-2">
            <span
              class="px-2.5 py-0.5 rounded text-[10px] font-black uppercase bg-primary text-on-primary tracking-wider"
            >
              MEMBRESÍA ACTIVA
            </span>
            <span class="text-xs text-text-sub font-semibold">
              {{ activeSubscription.autoRenew ? "• Renovación automática" : "• Pago único" }}
            </span>
          </div>
          <h2 class="text-lg font-bold text-white mt-1">
            {{ activeSubscription.planName }}
          </h2>
          <p class="text-xs text-text-sub mt-0.5">
            Vigente hasta el {{ formatDate(activeSubscription.endDate) }}
            <span v-if="activeSubscription.remainingDays !== undefined" class="text-primary font-bold">
              ({{ activeSubscription.remainingDays }} días restantes)
            </span>
          </p>
        </div>
      </div>

      <div class="flex items-center gap-3 w-full md:w-auto">
        <button
          type="button"
          @click="showTicketModal = true"
          class="btn-secondary h-10! text-xs! px-4 flex items-center justify-center gap-2 cursor-pointer flex-1 md:flex-none"
        >
          <QrCode class="w-4 h-4" /> Ver Credencial QR
        </button>
      </div>
    </div>

    <div v-if="plansLoading" class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div
        v-for="i in 3"
        :key="i"
        class="bg-surface border border-surface-light rounded-3xl p-6 animate-pulse space-y-4"
      >
        <div class="h-6 bg-surface-light rounded w-1/2"></div>
        <div class="h-3 bg-surface-light rounded w-3/4"></div>
        <div class="h-10 bg-surface-light rounded w-1/3 my-4"></div>
        <div class="space-y-2 py-4">
          <div class="h-3 bg-surface-light rounded w-full"></div>
          <div class="h-3 bg-surface-light rounded w-5/6"></div>
        </div>
        <div class="h-12 bg-surface-light rounded-2xl w-full"></div>
      </div>
    </div>

    <div
      v-else-if="enrollmentPlans.length > 0"
      class="grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      <div
        v-for="plan in enrollmentPlans"
        :key="plan.id"
        class="bg-surface border rounded-3xl p-6 flex flex-col justify-between hover:border-primary/40 transition relative group"
        :class="[
          plan.isCurrent
            ? 'border-2! border-primary! shadow-xl shadow-primary/10'
            : plan.discount > 0
              ? 'border-surface-light hover:border-primary/50'
              : 'border-surface-light',
        ]"
      >
        <div
          v-if="plan.isCurrent"
          class="absolute -top-3 left-6 bg-primary text-on-primary text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-wider flex items-center gap-1 shadow-md"
        >
          <CheckCircle class="w-3 h-3" /> TU PLAN ACTUAL
        </div>

        <div
          v-if="plan.discount > 0 && !plan.isCurrent"
          class="absolute -top-3 right-6 bg-primary text-on-primary text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-wider flex items-center gap-1 shadow-md"
        >
          <Tag class="w-3 h-3" /> {{ plan.discount }}% OFF
        </div>

        <div>
          <div class="flex justify-between items-start gap-2 pt-1">
            <div>
              <span class="text-[10px] uppercase font-bold text-primary tracking-wider">
                {{ plan.planType }}
              </span>
              <h2 class="text-lg font-bold text-white mt-0.5">{{ plan.name }}</h2>
            </div>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-surface-light text-text-sub">
              {{ plan.duration }} días
            </span>
          </div>

          <p class="text-xs text-text-sub mt-2 min-h-8">
            {{ plan.description }}
          </p>

          <div class="flex items-baseline gap-2 my-5">
            <span v-if="plan.discount > 0" class="text-sm font-semibold text-text-muted line-through">
              ${{ plan.price.toLocaleString("es-MX", { minimumFractionDigits: 2 }) }}
            </span>
            <span class="text-3xl font-black text-white">
              ${{ plan.finalPrice.toLocaleString("es-MX", { minimumFractionDigits: 2 }) }}
            </span>
            <span class="text-xs text-text-sub font-semibold">MXN</span>
          </div>

          <div class="border-t border-surface-light pt-4 my-4">
            <p class="text-[11px] font-bold uppercase tracking-wider text-text-sub mb-3">
              Beneficios incluidos
            </p>
            <ul v-if="plan.items && plan.items.length > 0" class="space-y-2.5 text-xs text-text-sub">
              <li
                v-for="item in plan.items.slice(0, 4)"
                :key="item.id || item.name"
                class="flex items-start gap-2"
              >
                <CheckCircle class="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span class="text-white">{{ item.name }}</span>
              </li>
              <li v-if="plan.items.length > 4">
                <button
                  type="button"
                  @click="openBenefits(plan)"
                  class="text-primary hover:underline text-xs font-semibold cursor-pointer"
                >
                  +{{ plan.items.length - 4 }} beneficios más...
                </button>
              </li>
            </ul>
            <p v-else class="text-xs text-text-muted italic">
              Acceso general a las instalaciones
            </p>
          </div>
        </div>

        <div class="space-y-2 pt-4">
          <template v-if="plan.isCurrent">
            <div class="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                @click="openEnrollModal(plan, true)"
                class="btn-primary h-11! text-xs! flex-1 flex items-center justify-center gap-1.5 cursor-pointer shadow-lg"
              >
                <RefreshCw class="w-3.5 h-3.5" /> Renovar
              </button>
              <button
                type="button"
                @click="confirmCancelSubscription"
                class="btn-secondary h-11! text-xs! flex-1 text-red-400 hover:text-red-300 hover:border-red-500/40 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <XCircle class="w-3.5 h-3.5" /> Cancelar
              </button>
            </div>
          </template>

          <template v-else-if="hasActiveSubscription">
            <button
              type="button"
              disabled
              class="w-full h-11 rounded-2xl bg-surface-light/40 border border-surface-light text-text-muted text-xs font-semibold cursor-not-allowed flex items-center justify-center gap-1.5"
              title="Ya cuentas con una membresía activa en esta sede"
            >
              Membresía activa en otro plan
            </button>
          </template>

          <template v-else>
            <button
              type="button"
              @click="openEnrollModal(plan, false)"
              class="btn-primary h-12! text-sm! w-full cursor-pointer shadow-lg"
            >
              Inscribirme a este Plan
            </button>
          </template>
        </div>
      </div>
    </div>

    <div
      v-else
      class="bg-surface border border-surface-light rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-4 max-w-md mx-auto"
    >
      <div class="w-16 h-16 rounded-3xl bg-surface-light flex items-center justify-center text-text-sub">
        <Dumbbell class="w-8 h-8" />
      </div>
      <div>
        <h3 class="text-base font-bold text-white">No hay planes disponibles</h3>
        <p class="text-xs text-text-sub mt-1">
          Esta sede aún no ha publicado planes activos para contratación.
        </p>
      </div>
      <NuxtLink to="/map" class="btn-secondary h-10! text-xs! px-4 cursor-pointer">
        Regresar al Mapa
      </NuxtLink>
    </div>

    <MoleculesBaseModal
      :hidden="showBenefitsModal"
      :title="selectedPlan?.name || 'Beneficios'"
      width="500px"
      :hide-footer="true"
      @cancel="showBenefitsModal = false"
    >
      <div v-if="selectedPlan" class="space-y-4">
        <p class="text-xs text-text-sub">{{ selectedPlan.description }}</p>
        <div class="space-y-2 max-h-60 overflow-y-auto pr-1">
          <div
            v-for="item in selectedPlan.items"
            :key="item.id || item.name"
            class="p-3 rounded-xl bg-surface-light/40 border border-surface-light/60 flex items-start gap-3"
          >
            <CheckCircle class="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div>
              <p class="text-xs font-bold text-white">{{ item.name }}</p>
              <p v-if="item.description" class="text-[11px] text-text-sub mt-0.5">
                {{ item.description }}
              </p>
            </div>
          </div>
        </div>
        <div class="pt-3 border-t border-surface-light flex justify-end">
          <button
            type="button"
            @click="showBenefitsModal = false"
            class="btn-secondary h-10! text-xs! px-4 cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </MoleculesBaseModal>

    <MoleculesBaseModal
      :hidden="showCheckoutModal"
      :title="isRenewing ? 'Renovación de Membresía' : 'Confirmar Inscripción y Pago'"
      width="480px"
      :hide-footer="true"
      @cancel="showCheckoutModal = false"
    >
      <div v-if="selectedPlan" class="space-y-5">
        <div class="p-4 rounded-2xl bg-bg-base border border-surface-light space-y-3">
          <div>
            <span class="text-[10px] uppercase font-bold text-primary tracking-wider">
              {{ gymDetail?.name || enrollmentData?.gymName }}
            </span>
            <h3 class="text-base font-bold text-white mt-0.5">{{ selectedPlan.name }}</h3>
            <p class="text-xs text-text-sub">Duración: {{ selectedPlan.duration }} días</p>
          </div>

          <div class="flex justify-between items-center pt-2 border-t border-surface-light">
            <span class="text-xs text-text-sub font-semibold">Total a Pagar:</span>
            <span class="text-2xl font-black text-primary">
              ${{ selectedPlan.finalPrice.toLocaleString("es-MX", { minimumFractionDigits: 2 }) }} MXN
            </span>
          </div>
        </div>

        <div class="space-y-3">
          <label class="flex items-center gap-2.5 text-xs text-white cursor-pointer select-none">
            <input
              type="checkbox"
              v-model="autoRenew"
              class="w-4 h-4 rounded border-surface-light text-primary focus:ring-primary/20 accent-primary"
            />
            <span>Renovar automáticamente al terminar el periodo</span>
          </label>
        </div>

        <div class="p-3 rounded-xl bg-primary/10 border border-primary/20 flex items-center gap-3">
          <ShieldCheck class="w-5 h-5 text-primary shrink-0" />
          <p class="text-[11px] text-text-sub">
            El cobro se procesará de forma 100% segura mediante <strong>Stripe</strong>. Podrás pagar con tarjeta de débito o crédito internacional.
          </p>
        </div>

        <div class="pt-2 flex gap-3">
          <button
            type="button"
            :disabled="processingPayment"
            @click="showCheckoutModal = false"
            class="btn-secondary h-11! text-xs! flex-1 cursor-pointer"
          >
            Regresar
          </button>
          <button
            type="button"
            :disabled="processingPayment"
            @click="handleStripeCheckout"
            class="btn-primary h-11! text-xs! flex-1 flex items-center justify-center gap-2 cursor-pointer shadow-lg"
          >
            <CreditCard class="w-4 h-4" />
            {{ processingPayment ? "Conectando con Stripe..." : isRenewing ? "Renovar con Stripe" : "Pagar con Stripe" }}
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
      <div v-if="activeSubscription" class="space-y-4 text-center py-2">
        <div class="w-12 h-12 rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center mx-auto">
          <AlertTriangle class="w-6 h-6" />
        </div>

        <div>
          <h3 class="text-base font-bold text-white">¿Deseas cancelar tu suscripción?</h3>
          <p class="text-xs text-text-sub mt-2">
            Tu membresía en <strong>{{ activeSubscription.planName }}</strong> se dará de baja. Se desactivará la renovación automática y mantendrás acceso hasta el final de tu vigencia ({{ formatDate(activeSubscription.endDate) }}).
          </p>
        </div>

        <div class="pt-2 flex gap-3">
          <button
            type="button"
            :disabled="processingCancel"
            @click="showCancelModal = false"
            class="btn-secondary h-11! text-xs! flex-1 cursor-pointer"
          >
            Conservar Plan
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

    <MoleculesBaseModal
      :hidden="showTicketModal"
      title="Credencial Digital de Acceso"
      width="440px"
      :hide-footer="true"
      @cancel="showTicketModal = false"
    >
      <div v-if="activeSubscription" class="space-y-6 text-center py-2">
        <div>
          <span class="text-[10px] uppercase font-bold text-primary tracking-wider">
            {{ gymDetail?.name || enrollmentData?.gymName }}
          </span>
          <h3 class="text-lg font-bold text-white mt-1">{{ activeSubscription.planName }}</h3>
          <p class="text-xs text-text-sub mt-0.5">Vigente hasta el {{ formatDate(activeSubscription.endDate) }}</p>
        </div>

        <div class="bg-white p-6 rounded-3xl inline-block shadow-2xl mx-auto border-4 border-primary">
          <img
            :src="`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${activeSubscription.slug}`"
            :alt="activeSubscription.slug"
            class="w-48 h-48 mx-auto"
          />
        </div>

        <div class="bg-bg-base border border-surface-light rounded-2xl p-3">
          <p class="text-[10px] text-text-muted uppercase font-bold tracking-wider">Código de Pase (Slug)</p>
          <p class="font-mono text-xs text-primary font-bold mt-1 break-all select-all">
            {{ activeSubscription.slug }}
          </p>
        </div>

        <div class="flex gap-2">
          <button
            type="button"
            :disabled="downloading"
            @click="
              downloadCredentialCard({
                gymName: gymDetail?.name || enrollmentData?.gymName || 'Fitbase Gym',
                planName: activeSubscription.planName,
                slug: activeSubscription.slug,
                endDate: formatDate(activeSubscription.endDate),
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
  </div>
</template>

<script setup lang="ts">
import {
	AlertTriangle,
	ArrowLeft,
	BadgeCheck,
	CheckCircle,
	CreditCard,
	Download,
	Dumbbell,
	QrCode,
	RefreshCw,
	ShieldCheck,
	Tag,
	XCircle,
} from "lucide-vue-next";
import { useToast } from "vue-toastification";

definePageMeta({
	layout: "user",
	requiresAuth: true,
	roles: [4],
});

const route = useRoute();
const toast = useToast();
const gymStore = useGymStore();
const planStore = usePlanStore();
const paymentStore = usePaymentStore();
const subscriptionStore = useSubscriptionStore();
const { downloading, downloadCredentialCard } = useCredentialDownload();

const { gymDetail } = storeToRefs(gymStore);
const {
	enrollmentData,
	enrollmentPlans,
	loading: plansLoading,
} = storeToRefs(planStore);

const gymId = computed(() => Number(route.params.id));
const hasActiveSubscription = computed(() =>
	Boolean(enrollmentData.value?.hasActiveSubscription),
);
const activeSubscription = computed(
	() => enrollmentData.value?.activeSubscription ?? null,
);

const selectedPlan = ref<Plan | null>(null);
const showBenefitsModal = ref(false);
const showCheckoutModal = ref(false);
const showCancelModal = ref(false);
const showTicketModal = ref(false);
const isRenewing = ref(false);
const autoRenew = ref(false);
const processingPayment = ref(false);
const processingCancel = ref(false);

const formatDate = (dateStr: string) => {
	if (!dateStr) return "";
	return new Date(dateStr).toLocaleDateString("es-MX", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
};

const openBenefits = (plan: Plan) => {
	selectedPlan.value = plan;
	showBenefitsModal.value = true;
};

const openEnrollModal = (plan: Plan, renewing = false) => {
	selectedPlan.value = plan;
	isRenewing.value = renewing;
	autoRenew.value = activeSubscription.value?.autoRenew ?? false;
	showCheckoutModal.value = true;
};

const confirmCancelSubscription = () => {
	showCancelModal.value = true;
};

const handleCancelSubscription = async () => {
	if (!activeSubscription.value?.id) return;

	processingCancel.value = true;
	try {
		const res = await subscriptionStore.cancelSubscription(
			activeSubscription.value.id,
		);
		if (res.isSuccess) {
			toast.success(res.getMessage || "Suscripción cancelada exitosamente");
			showCancelModal.value = false;
			if (gymId.value) {
				await planStore.getEnrollmentPlans(gymId.value);
			}
		} else {
			toast.error(res.getError?.msg || "No se pudo cancelar la suscripción");
		}
	} catch (_) {
		toast.error("Ocurrió un error al cancelar la suscripción");
	} finally {
		processingCancel.value = false;
	}
};

const handleStripeCheckout = async () => {
	if (!selectedPlan.value?.id || !gymId.value) return;

	processingPayment.value = true;
	try {
		const res = await paymentStore.createStripeCheckoutSession({
			gym_id: gymId.value,
			plan_id: selectedPlan.value.id,
			type: "subscription",
			auto_renew: autoRenew.value,
		});

		if (res.isSuccess && paymentStore.checkoutSession?.checkoutUrl) {
			window.location.href = paymentStore.checkoutSession.checkoutUrl;
		} else {
			toast.error(
				res.getError?.msg || "No se pudo iniciar la pasarela de pago.",
			);
		}
	} catch (_) {
		toast.error("Ocurrió un error al procesar el pago.");
	} finally {
		processingPayment.value = false;
	}
};

onMounted(async () => {
	if (gymId.value) {
		await Promise.all([
			gymStore.getGymDetail(gymId.value),
			planStore.getEnrollmentPlans(gymId.value),
		]);
	}
});
</script>
