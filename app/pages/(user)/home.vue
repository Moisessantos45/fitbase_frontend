<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div
          class="w-12 h-12 rounded-full bg-surface-light border-2 border-primary flex items-center justify-center text-primary overflow-hidden shrink-0 shadow-md"
        >
          <img
            v-if="userForm.avatarURL && userForm.avatarURL.trim()"
            :src="userForm.avatarURL"
            alt="Avatar"
            class="w-full h-full object-cover"
          />
          <User v-else class="w-6 h-6" />
        </div>
        <div>
          <h1 class="text-lg font-bold text-white">
            Hola, {{ userForm.firstName ? `${userForm.firstName} ${userForm.lastName}` : "Socio" }} 👋
          </h1>
          <p
            class="text-xs font-semibold flex items-center gap-1.5"
            :class="activeSubscription ? 'text-primary' : 'text-text-sub'"
          >
            <span
              class="w-2 h-2 rounded-full"
              :class="activeSubscription ? 'bg-primary animate-pulse' : 'bg-text-muted'"
            ></span>
            {{
              activeSubscription
                ? `Membresía Activa • ${activeSubscription.planName}`
                : "Sin membresía activa actualmente"
            }}
          </p>
        </div>
      </div>

      <NuxtLink
        to="/profile"
        class="w-11 h-11 rounded-2xl bg-surface border border-surface-light flex items-center justify-center text-text-sub hover:text-primary transition"
        title="Mi Perfil"
      >
        <User class="w-5 h-5" />
      </NuxtLink>
    </div>

    <div
      v-if="activeSubscription"
      class="gradient-card-lime rounded-3xl p-6 border border-primary/40 shadow-xl relative overflow-hidden"
    >
      <div class="flex justify-between items-center mb-4">
        <span class="text-xs font-medium text-text-sub">
          Pase Digital de Acceso
        </span>
        <span
          class="px-2.5 py-1 rounded-md text-[10px] font-black uppercase bg-primary text-on-primary flex items-center gap-1 shadow-sm"
        >
          <CheckCircle class="w-3 h-3" /> QR LISTO
        </span>
      </div>

      <div class="flex flex-col sm:flex-row items-center gap-5">
        <div
          @click="openQrModal(activeSubscription)"
          class="bg-white p-3 rounded-2xl cursor-pointer hover:scale-105 transition transform shadow-lg shrink-0 border-2 border-primary/30"
          title="Clic para ampliar código QR"
        >
          <img
            :src="`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${activeSubscription.slug}`"
            :alt="activeSubscription.slug"
            class="w-24 h-24 object-contain"
          />
        </div>
        <div class="flex-1 text-center sm:text-left">
          <div class="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-semibold text-primary">
            <MapPin class="w-3.5 h-3.5" /> {{ activeSubscription.gymName }}
          </div>
          <h2 class="text-lg font-bold text-white mt-0.5">
            {{ activeSubscription.planName }}
          </h2>
          <p class="text-xs text-text-sub mt-1">
            Muestra esta credencial en el lector del mostrador o torniquete para ingresar.
          </p>
          <div
            class="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-3"
          >
            <span
              class="text-[11px] font-semibold text-primary flex items-center gap-1 bg-primary/10 px-2.5 py-1 rounded-lg border border-primary/20"
            >
              <Clock class="w-3.5 h-3.5" /> Vence: {{ formatDate(activeSubscription.endDate) }}
            </span>
            <button
              type="button"
              @click="openQrModal(activeSubscription)"
              class="text-xs font-bold text-white underline hover:text-primary cursor-pointer"
            >
              Ampliar QR
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-else
      class="bg-surface border border-surface-light rounded-3xl p-6 sm:p-7 shadow-xl relative overflow-hidden"
    >
      <div class="flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <div
          class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 shadow-inner"
        >
          <Dumbbell class="w-7 h-7 sm:w-8 sm:h-8" />
        </div>

        <div class="flex-1 text-center sm:text-left min-w-0">
          <h2 class="text-base sm:text-lg font-bold text-white">
            Aún no cuentas con una membresía activa
          </h2>
          <p class="text-xs text-text-sub mt-1.5 leading-relaxed">
            Explora las sedes disponibles en Fitbase, contrata tu plan preferido y obtén tu pase digital de acceso inmediato.
          </p>
          <div class="mt-4 flex items-center justify-center sm:justify-start">
            <NuxtLink
              to="/map"
              class="btn-primary h-10! text-xs! px-5 inline-flex items-center gap-2 cursor-pointer shadow-md"
            >
              <MapPin class="w-4 h-4" /> Explorar Sedes
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <div>
      <h2 class="text-base font-bold text-white mb-3">Acciones Rápidas</h2>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <NuxtLink
          to="/subscriptions"
          class="bg-surface border border-surface-light hover:border-primary/50 rounded-2xl p-4 flex flex-col items-center text-center transition group cursor-pointer"
        >
          <div
            class="w-11 h-11 rounded-full bg-surface-light group-hover:bg-primary/10 flex items-center justify-center text-primary mb-2 transition"
          >
            <BadgeCheck class="w-5 h-5" />
          </div>
          <span class="text-xs font-semibold text-white">Membresías</span>
          <span class="text-[10px] text-text-sub mt-0.5">Mis pases y QR</span>
        </NuxtLink>

        <NuxtLink
          to="/payments"
          class="bg-surface border border-surface-light hover:border-primary/50 rounded-2xl p-4 flex flex-col items-center text-center transition group cursor-pointer"
        >
          <div
            class="w-11 h-11 rounded-full bg-surface-light group-hover:bg-primary/10 flex items-center justify-center text-primary mb-2 transition"
          >
            <CreditCard class="w-5 h-5" />
          </div>
          <span class="text-xs font-semibold text-white">Pagos</span>
          <span class="text-[10px] text-text-sub mt-0.5">Recibos e historial</span>
        </NuxtLink>

        <NuxtLink
          to="/map"
          class="bg-surface border border-surface-light hover:border-primary/50 rounded-2xl p-4 flex flex-col items-center text-center transition group cursor-pointer"
        >
          <div
            class="w-11 h-11 rounded-full bg-surface-light group-hover:bg-primary/10 flex items-center justify-center text-primary mb-2 transition"
          >
            <MapPin class="w-5 h-5" />
          </div>
          <span class="text-xs font-semibold text-white">Sedes</span>
          <span class="text-[10px] text-text-sub mt-0.5">Buscar gimnasios</span>
        </NuxtLink>

        <NuxtLink
          to="/profile"
          class="bg-surface border border-surface-light hover:border-primary/50 rounded-2xl p-4 flex flex-col items-center text-center transition group cursor-pointer"
        >
          <div
            class="w-11 h-11 rounded-full bg-surface-light group-hover:bg-primary/10 flex items-center justify-center text-primary mb-2 transition"
          >
            <User class="w-5 h-5" />
          </div>
          <span class="text-xs font-semibold text-white">Mi Perfil</span>
          <span class="text-[10px] text-text-sub mt-0.5">Datos y cuenta</span>
        </NuxtLink>
      </div>
    </div>

    <div>
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-base font-bold text-white">
          Mis Planes y Membresías
        </h2>
        <NuxtLink
          to="/subscriptions"
          class="text-xs font-bold text-primary hover:underline flex items-center gap-1"
        >
          Ver todas <ChevronRight class="w-3.5 h-3.5" />
        </NuxtLink>
      </div>

      <div v-if="loadingSubscriptions" class="space-y-3">
        <div
          v-for="i in 2"
          :key="i"
          class="bg-surface border border-surface-light rounded-2xl p-4 animate-pulse h-20"
        ></div>
      </div>

      <div v-else-if="mySubscriptions.length > 0" class="space-y-3">
        <div
          v-for="sub in mySubscriptions.slice(0, 3)"
          :key="sub.id"
          class="bg-surface border border-surface-light hover:border-primary/40 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-11 h-11 rounded-xl bg-surface-light flex items-center justify-center text-primary shrink-0"
            >
              <Dumbbell class="w-5 h-5" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-sm font-bold text-white">
                  {{ sub.planName }}
                </h3>
                <span
                  class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                  :class="
                    sub.statusName === 'Activo'
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'bg-surface-light text-text-sub'
                  "
                >
                  {{ sub.statusName }}
                </span>
              </div>
              <p class="text-xs text-text-sub flex items-center gap-1 mt-0.5">
                <MapPin class="w-3 h-3 text-primary" /> {{ sub.gymName }}
              </p>
              <p class="text-[11px] text-text-muted flex items-center gap-1 mt-0.5">
                <Calendar class="w-3 h-3" /> Vigencia: {{ formatDate(sub.startDate) }} - {{ formatDate(sub.endDate) }}
              </p>
            </div>
          </div>

          <div class="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-surface-light">
            <span class="text-sm font-black text-white">
              ${{ sub.planPrice.toLocaleString("es-MX", { minimumFractionDigits: 2 }) }} MXN
            </span>
            <button
              type="button"
              @click="openQrModal(sub)"
              class="btn-secondary h-9! text-xs! px-3 flex items-center gap-1.5 cursor-pointer"
            >
              <QrCode class="w-3.5 h-3.5" /> Credencial
            </button>
          </div>
        </div>
      </div>

      <div
        v-else
        class="bg-surface border border-surface-light rounded-2xl p-6 text-center text-text-sub text-xs"
      >
        No tienes membresías registradas actualmente.
      </div>
    </div>

    <div>
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-base font-bold text-white">
          Pagos Recientes
        </h2>
        <NuxtLink
          to="/payments"
          class="text-xs font-bold text-primary hover:underline flex items-center gap-1"
        >
          Historial completo <ChevronRight class="w-3.5 h-3.5" />
        </NuxtLink>
      </div>

      <div v-if="loadingPayments" class="space-y-3">
        <div
          v-for="i in 2"
          :key="i"
          class="bg-surface border border-surface-light rounded-2xl p-4 animate-pulse h-16"
        ></div>
      </div>

      <div v-else-if="payments.length > 0" class="space-y-3">
        <div
          v-for="payment in payments.slice(0, 3)"
          :key="payment.id"
          class="bg-surface border border-surface-light rounded-2xl p-4 flex items-center justify-between gap-3"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-xl bg-surface-light flex items-center justify-center text-primary shrink-0"
            >
              <CreditCard class="w-5 h-5" />
            </div>
            <div>
              <h3 class="text-xs font-bold text-white">
                {{ payment.gymName || "Fitbase Gym" }}
              </h3>
              <p class="text-[11px] text-text-sub">
                {{ payment.paymentMethodName || "Tarjeta / Stripe" }} • {{ formatDate(payment.paymentDate || payment.createdAt) }}
              </p>
            </div>
          </div>

          <div class="text-right">
            <span class="text-xs font-bold text-white">
              ${{ payment.amount.toLocaleString("es-MX", { minimumFractionDigits: 2 }) }} MXN
            </span>
            <span
              class="block text-[10px] font-semibold mt-0.5"
              :class="payment.paymentStatusName === 'Completado' ? 'text-primary' : 'text-text-sub'"
            >
              {{ payment.paymentStatusName || "Aprobado" }}
            </span>
          </div>
        </div>
      </div>

      <div
        v-else
        class="bg-surface border border-surface-light rounded-2xl p-6 text-center text-text-sub text-xs"
      >
        No hay registros de pagos recientes.
      </div>
    </div>

    <div>
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-base font-bold text-white">
          Mis Visitas Recientes
        </h2>
      </div>

      <div v-if="myHistory.length > 0" class="space-y-3">
        <div
          v-for="entry in myHistory.slice(0, 3)"
          :key="entry.id"
          class="bg-surface border border-surface-light rounded-2xl p-4 flex items-center justify-between gap-3"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0"
            >
              <CheckCircle class="w-5 h-5" />
            </div>
            <div>
              <h3 class="text-xs font-bold text-white">
                {{ entry.gymName }}
              </h3>
              <p class="text-[11px] text-text-sub">
                {{ entry.accessTypeName }} • {{ formatTime(entry.checkedInAt) }} del {{ formatDate(entry.checkedInAt) }}
              </p>
            </div>
          </div>
          <span
            class="px-2.5 py-1 rounded-md text-[10px] font-bold bg-success/10 text-success border border-success/20"
          >
            Completada
          </span>
        </div>
      </div>

      <div
        v-else
        class="bg-surface border border-surface-light rounded-2xl p-6 text-center text-text-sub text-xs"
      >
        Aún no registras visitas a tus gimnasios.
      </div>
    </div>

    <div
      v-if="showQrModal && selectedTicket"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
    >
      <div
        class="bg-surface border-2 border-primary rounded-3xl w-full max-w-sm p-6 text-center space-y-4 shadow-2xl"
      >
        <div class="flex justify-between items-center">
          <span
            class="px-2.5 py-1 rounded text-[10px] font-black uppercase bg-primary text-on-primary"
          >
            PASE DIGITAL DE ACCESO
          </span>
          <button
            type="button"
            @click="showQrModal = false"
            class="p-1 rounded-xl text-text-sub hover:text-white cursor-pointer"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <div>
          <span class="text-[10px] uppercase font-bold text-primary tracking-wider">
            {{ selectedTicket.gymName }}
          </span>
          <h3 class="text-lg font-black text-white mt-0.5">
            {{ selectedTicket.planName }}
          </h3>
          <p class="text-xs text-text-sub mt-0.5">
            Socio: {{ userForm.firstName ? `${userForm.firstName} ${userForm.lastName}` : "Usuario Fitbase" }}
          </p>
        </div>

        <div class="bg-white p-5 rounded-2xl mx-auto inline-block shadow-2xl border-4 border-primary">
          <img
            :src="`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${selectedTicket.slug}`"
            :alt="selectedTicket.slug"
            class="w-48 h-48 mx-auto object-contain"
          />
        </div>

        <div class="bg-bg-base border border-surface-light rounded-xl p-2.5">
          <p class="text-[10px] text-text-muted uppercase font-bold tracking-wider">Código de Pase</p>
          <p class="font-mono text-[11px] text-primary font-bold mt-0.5 break-all select-all">
            {{ selectedTicket.slug }}
          </p>
        </div>

        <p class="text-[11px] text-text-sub">
          Coloca este código frente al lector óptico o torniquete para ingresar.
        </p>

        <div class="flex gap-2">
          <button
            type="button"
            :disabled="downloading"
            @click="
              downloadCredentialCard({
                gymName: selectedTicket.gymName,
                planName: selectedTicket.planName,
                slug: selectedTicket.slug,
                endDate: formatDate(selectedTicket.endDate),
                memberName: userForm.firstName ? `${userForm.firstName} ${userForm.lastName}` : undefined,
              })
            "
            class="btn-primary h-11! text-xs! flex-1 flex items-center justify-center gap-2 cursor-pointer shadow-lg"
          >
            <Download class="w-4 h-4" />
            {{ downloading ? "Generando..." : "Descargar Imagen QR" }}
          </button>
          <button
            type="button"
            @click="showQrModal = false"
            class="btn-secondary h-11! text-xs! px-4 cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
	BadgeCheck,
	Calendar,
	CheckCircle,
	ChevronRight,
	Clock,
	CreditCard,
	Download,
	Dumbbell,
	MapPin,
	QrCode,
	User,
	X,
} from "lucide-vue-next";

definePageMeta({
	name: "home",
	layout: "user",
	requiresAuth: true,
	roles: [4],
});

const userStore = useUserStore();
const { userForm } = storeToRefs(userStore);

const subscriptionStore = useSubscriptionStore();
const { mySubscriptions, loading: loadingSubscriptions } =
	storeToRefs(subscriptionStore);

const paymentStore = usePaymentStore();
const { payments, loading: loadingPayments } = storeToRefs(paymentStore);

const checkInStore = useCheckInStore();
const { myHistory } = storeToRefs(checkInStore);

const { downloading, downloadCredentialCard } = useCredentialDownload();

const showQrModal = ref(false);
const selectedTicket = ref<SubscriptionItem | null>(null);

const activeSubscription = computed(() => {
	return (
		mySubscriptions.value.find((sub) => sub.statusName === "Activo") ||
		mySubscriptions.value[0] ||
		null
	);
});

const formatDate = (dateStr: string) => {
	if (!dateStr) return "";
	return new Date(dateStr).toLocaleDateString("es-MX", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
};

const formatTime = (dateStr: string) => {
	if (!dateStr) return "";
	return new Date(dateStr).toLocaleTimeString("es-MX", {
		hour: "2-digit",
		minute: "2-digit",
	});
};

const openQrModal = (ticket: SubscriptionItem) => {
	selectedTicket.value = ticket;
	showQrModal.value = true;
};

onMounted(async () => {
	await Promise.allSettled([
		userStore.getUser(),
		subscriptionStore.getMySubscriptions(1, 10),
		paymentStore.getMyPayments(1, 5),
		checkInStore.getMyHistory(1, 3),
	]);
});
</script>
