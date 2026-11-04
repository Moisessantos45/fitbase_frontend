<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-white">Recepción y Control de Acceso</h1>
        <p class="text-sm text-text-sub mt-1">
          Valida entradas físicas, gestiona y cobra pases de un día, y registra invitados en mostrador
        </p>
      </div>

      <div class="flex items-center gap-2">
        <span
          v-if="gymForm.name"
          class="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary flex items-center gap-1.5"
        >
          <Building2 class="w-3.5 h-3.5" /> {{ gymForm.name }}
        </span>
      </div>
    </div>

    <div class="flex border-b border-surface-light gap-4">
      <button
        type="button"
        @click="activeTab = 'checkin'"
        class="pb-3 text-sm font-bold transition flex items-center gap-2 cursor-pointer border-b-2"
        :class="activeTab === 'checkin' ? 'border-primary text-primary' : 'border-transparent text-text-sub hover:text-white'"
      >
        <ScanLine class="w-4 h-4" /> Torniquete y Validación
      </button>
      <button
        type="button"
        @click="activeTab = 'daypasses'"
        class="pb-3 text-sm font-bold transition flex items-center gap-2 cursor-pointer border-b-2"
        :class="activeTab === 'daypasses' ? 'border-primary text-primary' : 'border-transparent text-text-sub hover:text-white'"
      >
        <Ticket class="w-4 h-4" /> Pases de un Día y Cobro en Caja
      </button>
    </div>

    <div v-if="activeTab === 'checkin'" class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div class="lg:col-span-5 space-y-6">
        <div class="bg-surface border border-surface-light rounded-3xl p-6 shadow-xl space-y-5">
          <div class="flex rounded-2xl bg-bg-base p-1 border border-surface-light">
            <button
              type="button"
              @click="setValidationMode('qr')"
              class="flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
              :class="
                validationMode === 'qr'
                  ? 'bg-primary text-on-primary shadow-md'
                  : 'text-text-sub hover:text-white'
              "
            >
              <QrCode class="w-4 h-4" /> Escáner QR
            </button>
            <button
              type="button"
              @click="setValidationMode('email')"
              class="flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
              :class="
                validationMode === 'email'
                  ? 'bg-primary text-on-primary shadow-md'
                  : 'text-text-sub hover:text-white'
              "
            >
              <Mail class="w-4 h-4" /> Correo Electrónico
            </button>
          </div>

          <form v-if="validationMode === 'qr'" @submit.prevent="handleValidateQr" class="space-y-4">
            <div class="space-y-1.5">
              <label class="text-xs font-bold text-text-sub block uppercase tracking-wider">
                Código QR de Acceso (Slug)
              </label>
              <div class="relative">
                <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-sub">
                  <ScanLine class="w-5 h-5 text-primary" />
                </span>
                <input
                  ref="qrInputRef"
                  type="text"
                  v-model="qrSlug"
                  placeholder="Escanea o pega el código UUID del pase..."
                  class="input-field pl-11 font-mono text-xs!"
                  :disabled="loading"
                  autofocus
                />
              </div>
              <p class="text-[11px] text-text-muted">
                Compatible con lectores ópticos USB/Bluetooth. Presionar Enter envía automáticamente.
              </p>
            </div>

            <button
              type="submit"
              :disabled="loading || !qrSlug.trim()"
              class="btn-primary h-12! text-xs! w-full flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-40"
            >
              <CheckCircle class="w-4 h-4" />
              {{ loading ? "Validando en torniquete..." : "Registrar Entrada por QR" }}
            </button>
          </form>

          <form v-else @submit.prevent="handleValidateEmail" class="space-y-4">
            <div class="space-y-1.5">
              <label class="text-xs font-bold text-text-sub block uppercase tracking-wider">
                Correo Electrónico del Socio
              </label>
              <div class="relative">
                <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-sub">
                  <Mail class="w-5 h-5 text-primary" />
                </span>
                <input
                  type="email"
                  v-model="clientEmail"
                  placeholder="ejemplo@correo.com"
                  class="input-field pl-11 text-xs!"
                  :disabled="loading"
                  autofocus
                />
              </div>
              <p class="text-[11px] text-text-muted">
                Busca la membresía o day pass activo contratado por el socio en esta sede.
              </p>
            </div>

            <button
              type="submit"
              :disabled="loading || !clientEmail.trim()"
              class="btn-primary h-12! text-xs! w-full flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-40"
            >
              <CheckCircle class="w-4 h-4" />
              {{ loading ? "Validando socio..." : "Registrar Entrada por Correo" }}
            </button>
          </form>
        </div>

        <div
          v-if="lastResult"
          class="bg-success/10 border-2 border-success/40 rounded-3xl p-6 text-center space-y-4 shadow-xl animate-in fade-in"
        >
          <div class="w-14 h-14 rounded-2xl bg-success text-on-primary flex items-center justify-center mx-auto shadow-lg">
            <CheckCircle2 class="w-8 h-8" />
          </div>

          <div>
            <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-success text-on-primary tracking-wider shadow-sm">
              ACCESO CONCEDIDO
            </span>
            <h2 class="text-xl font-bold text-white mt-3">
              {{ lastResult.fullName || "Socio Fitbase" }}
            </h2>
            <p class="text-xs font-semibold text-primary mt-1">
              {{ lastResult.planName || "Pase de Acceso" }} • {{ lastResult.accessType }}
            </p>
            <p class="text-[11px] text-text-sub mt-2">
              Registrado a las {{ formatTime(lastResult.checkedInAt) }} del {{ formatDate(lastResult.checkedInAt) }}
            </p>
          </div>

          <button
            type="button"
            @click="resetScan"
            class="btn-secondary h-10! text-xs! w-full cursor-pointer"
          >
            Siguiente Entrada
          </button>
        </div>

        <div
          v-else-if="lastError"
          class="bg-error/10 border-2 border-error/40 rounded-3xl p-6 text-center space-y-4 shadow-xl animate-in fade-in"
        >
          <div class="w-14 h-14 rounded-2xl bg-error text-white flex items-center justify-center mx-auto shadow-lg">
            <AlertTriangle class="w-8 h-8" />
          </div>

          <div>
            <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-error text-white tracking-wider shadow-sm">
              ACCESO DENEGADO
            </span>
            <h2 class="text-base font-bold text-white mt-3">
              No se permitió la entrada
            </h2>
            <p class="text-xs text-error mt-2 px-2 font-semibold">
              {{ lastError }}
            </p>
          </div>

          <button
            type="button"
            @click="resetScan"
            class="btn-secondary h-10! text-xs! w-full cursor-pointer"
          >
            Intentar de Nuevo
          </button>
        </div>
      </div>

      <div class="lg:col-span-7 space-y-4">
        <div class="bg-surface border border-surface-light rounded-3xl p-6 shadow-xl space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-surface-light">
            <div>
              <h2 class="text-base font-bold text-white flex items-center gap-2">
                <Clock class="w-4 h-4 text-primary" /> Bitácora de Accesos
              </h2>
              <p class="text-xs text-text-sub mt-0.5">
                Entradas registradas recientemente en esta sucursal
              </p>
            </div>

            <div class="flex items-center gap-2">
              <input
                type="date"
                v-model="filterDate"
                @change="applyDateFilter"
                class="bg-surface-light border border-surface-light rounded-xl px-3 py-1.5 text-xs text-white"
                title="Filtrar por fecha"
              />
              <button
                type="button"
                @click="refreshCheckIns"
                class="w-8 h-8 rounded-xl bg-surface-light flex items-center justify-center text-text-sub hover:text-white transition cursor-pointer"
                title="Actualizar bitácora"
              >
                <RefreshCw class="w-3.5 h-3.5" :class="{ 'animate-spin': loadingCheckIns }" />
              </button>
            </div>
          </div>

          <div v-if="loadingCheckIns && checkIns.length === 0" class="space-y-3 py-4">
            <div v-for="i in 4" :key="i" class="h-14 bg-surface-light rounded-2xl animate-pulse"></div>
          </div>

          <div v-else-if="checkIns.length > 0" class="space-y-2.5 overflow-x-auto">
            <div
              v-for="record in checkIns"
              :key="record.id"
              class="p-3.5 rounded-2xl bg-bg-base/60 border border-surface-light hover:border-primary/30 flex items-center justify-between gap-3 transition"
            >
              <div class="flex items-center gap-3 min-w-0 flex-1">
                <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                  <UserCheck class="w-5 h-5" />
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-xs font-bold text-white truncate">
                    {{ record.userFullName || "Acceso registrado" }}
                  </p>
                  <p class="text-[11px] text-text-sub mt-0.5 flex items-center gap-2 truncate">
                    <span class="text-primary font-semibold">{{ record.accessTypeName }}</span>
                    <span>•</span>
                    <span class="truncate">Operador: {{ record.registeredByName || "Sistema" }}</span>
                  </p>
                </div>
              </div>

              <div class="text-right shrink-0">
                <span class="text-xs font-bold text-white block">
                  {{ formatTime(record.checkedInAt) }}
                </span>
                <span class="text-[10px] text-text-sub block mt-0.5">
                  {{ formatDate(record.checkedInAt) }}
                </span>
              </div>
            </div>
          </div>

          <div v-else class="p-8 text-center text-text-sub text-xs">
            No se han registrado accesos para el filtro seleccionado.
          </div>

          <div
            v-if="pagination.totalPages > 1"
            class="flex items-center justify-center gap-2 pt-3 border-t border-surface-light"
          >
            <button
              type="button"
              :disabled="pagination.page <= 1"
              @click="goToPage(pagination.page - 1)"
              class="btn-secondary h-8! text-xs! px-3! disabled:opacity-40 cursor-pointer"
            >
              Anterior
            </button>
            <span class="text-xs text-text-sub px-2">
              Página {{ pagination.page }} de {{ pagination.totalPages }}
            </span>
            <button
              type="button"
              :disabled="pagination.page >= pagination.totalPages"
              @click="goToPage(pagination.page + 1)"
              class="btn-secondary h-8! text-xs! px-3! disabled:opacity-40 cursor-pointer"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="activeTab === 'daypasses'" class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div class="lg:col-span-4 space-y-6">
          <div class="bg-surface border border-surface-light rounded-3xl p-6 shadow-xl space-y-4">
            <div class="flex items-center justify-between pb-2 border-b border-surface-light">
              <h2 class="text-sm font-bold text-white flex items-center gap-2">
                <UserPlus class="w-4 h-4 text-primary" /> Registrar Visita en Mostrador
              </h2>
            </div>

            <form @submit.prevent="handleRegisterGuest" class="space-y-3.5">
              <div class="space-y-1">
                <label class="text-[11px] font-bold text-text-sub block">Nombre Completo *</label>
                <input
                  type="text"
                  v-model="walkInForm.fullName"
                  placeholder="Ej. Carlos Santillán"
                  class="input-field h-10! py-1.5! text-xs w-full"
                  required
                />
              </div>

              <div class="space-y-1">
                <label class="text-[11px] font-bold text-text-sub block">Teléfono / Celular *</label>
                <input
                  type="tel"
                  v-model="walkInForm.phone"
                  placeholder="+52 55..."
                  class="input-field h-10! py-1.5! text-xs w-full"
                  required
                />
              </div>

              <div class="space-y-1">
                <label class="text-[11px] font-bold text-text-sub block">Correo Electrónico *</label>
                <input
                  type="email"
                  v-model="walkInForm.email"
                  placeholder="visitante@gmail.com"
                  class="input-field h-10! py-1.5! text-xs w-full"
                  required
                />
              </div>

              <div class="space-y-1">
                <label class="text-[11px] font-bold text-text-sub block">Plan / Tipo de Pase *</label>
                <select
                  v-model="walkInForm.planId"
                  class="input-field h-10! py-1.5! text-xs w-full"
                  required
                >
                  <option :value="undefined" disabled>Seleccionar pase de 1 día...</option>
                  <option v-for="plan in availablePassPlans" :key="plan.id" :value="plan.id">
                    {{ plan.name }} — ${{ plan.price }}
                  </option>
                </select>
              </div>

              <button
                type="submit"
                :disabled="daypassLoading || !isWalkInFormValid"
                class="btn-primary h-11! text-xs! w-full flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-40"
              >
                <div v-if="daypassLoading" class="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                <Ticket v-else class="w-4 h-4" />
                Registrar Pase de Invitado
              </button>
            </form>
          </div>
        </div>

        <div class="lg:col-span-8 space-y-4">
          <div class="bg-surface border border-surface-light rounded-3xl p-6 shadow-xl space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-surface-light">
              <div>
                <h2 class="text-base font-bold text-white flex items-center gap-2">
                  <Ticket class="w-4 h-4 text-primary" /> Pases Emitidos
                </h2>
                <p class="text-xs text-text-sub mt-0.5">
                  Busca por nombre, correo, teléfono o código para verificar pago y cobrar en mostrador
                </p>
              </div>

              <div class="flex items-center gap-2">
                <div class="relative">
                  <Search class="w-3.5 h-3.5 text-text-muted absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    v-model="daypassSearch"
                    placeholder="Buscar visitante..."
                    class="bg-surface-light border border-surface-light rounded-xl pl-8 pr-3 py-1.5 text-xs text-white"
                  />
                </div>
                <button
                  type="button"
                  @click="refreshDayPasses"
                  class="w-8 h-8 rounded-xl bg-surface-light flex items-center justify-center text-text-sub hover:text-white transition cursor-pointer"
                  title="Actualizar listado"
                >
                  <RefreshCw class="w-3.5 h-3.5" :class="{ 'animate-spin': daypassLoading }" />
                </button>
              </div>
            </div>

            <div v-if="daypassLoading && dayPasses.length === 0" class="space-y-3 py-4">
              <div v-for="i in 3" :key="i" class="h-16 bg-surface-light rounded-2xl animate-pulse"></div>
            </div>

            <div v-else-if="dayPasses.length > 0" class="space-y-3">
              <div
                v-for="pass in dayPasses"
                :key="pass.id"
                class="p-4 rounded-2xl bg-bg-base/70 border border-surface-light flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div class="space-y-1 min-w-0 flex-1">
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="text-xs font-bold text-white">{{ pass.fullName }}</span>
                    <span
                      class="px-2 py-0.5 rounded text-[10px] font-bold"
                      :class="pass.isPaid ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'"
                    >
                      {{ pass.isPaid ? "Pagado" : "Pendiente de Cobro" }}
                    </span>
                    <span
                      v-if="pass.isUsed"
                      class="px-2 py-0.5 rounded text-[10px] font-bold bg-surface-light text-text-muted"
                    >
                      Ya Utilizado
                    </span>
                  </div>

                  <p class="text-[11px] text-text-sub flex items-center gap-2 truncate">
                    <span>{{ pass.planName }} (${{ pass.planPrice }})</span>
                    <span>•</span>
                    <span>Visita: {{ pass.visitDate }}</span>
                  </p>
                  <p class="text-[10px] font-mono text-text-muted truncate">
                    UUID: {{ pass.slug }}
                  </p>
                </div>

                <div class="flex items-center gap-2 shrink-0">
                  <button
                    v-if="!pass.isPaid"
                    type="button"
                    @click="openChargeModal(pass)"
                    class="btn-primary h-9! text-xs! px-3! flex items-center gap-1.5 cursor-pointer font-bold shadow-sm"
                  >
                    <Banknote class="w-3.5 h-3.5" /> Cobrar ${{ pass.planPrice }}
                  </button>
                  <button
                    v-if="pass.isPaid && !pass.isUsed"
                    type="button"
                    @click="fastCheckInPass(pass.slug)"
                    class="btn-secondary h-9! text-xs! px-3! flex items-center gap-1.5 cursor-pointer text-success border-success/30 hover:bg-success/10"
                  >
                    <UserCheck class="w-3.5 h-3.5" /> Dar Acceso
                  </button>
                </div>
              </div>
            </div>

            <div v-else class="p-8 text-center text-text-sub text-xs">
              No se encontraron pases de un solo uso con los filtros seleccionados.
            </div>
          </div>
        </div>
      </div>
    </div>

    <MoleculesBaseModal
      :hidden="showChargeModal"
      title="Cobro en Caja Mostrador"
      width="460px"
      :hide-footer="true"
      @cancel="closeChargeModal"
    >
      <div v-if="targetPassToCharge" class="space-y-4">
        <div class="p-4 rounded-2xl bg-bg-base border border-surface-light space-y-2 text-xs">
          <div class="flex justify-between items-center">
            <span class="text-text-sub">Visitante:</span>
            <span class="font-bold text-white">{{ targetPassToCharge.fullName }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-text-sub">Concepto:</span>
            <span class="font-bold text-white">{{ targetPassToCharge.planName }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-text-sub">Total a Cobrar:</span>
            <span class="font-black text-primary text-base">${{ targetPassToCharge.planPrice }}</span>
          </div>
        </div>

        <div class="space-y-1.5">
          <label class="text-xs font-bold text-text-sub block">Método de Pago:</label>
          <div class="grid grid-cols-2 gap-2">
            <button
              type="button"
              @click="chargeMethodId = 1"
              class="py-2.5 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
              :class="chargeMethodId === 1 ? 'bg-primary text-on-primary border-primary shadow-sm' : 'bg-surface-light/40 border-surface-light text-text-sub'"
            >
              <Banknote class="w-4 h-4" /> Efectivo (Caja)
            </button>
            <button
              type="button"
              @click="chargeMethodId = 2"
              class="py-2.5 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
              :class="chargeMethodId === 2 ? 'bg-primary text-on-primary border-primary shadow-sm' : 'bg-surface-light/40 border-surface-light text-text-sub'"
            >
              <CreditCard class="w-4 h-4" /> Terminal POS
            </button>
          </div>
        </div>

        <div class="pt-2 flex items-center justify-end gap-2">
          <button type="button" @click="closeChargeModal" class="btn-secondary h-10! text-xs! px-4! cursor-pointer">
            Cancelar
          </button>
          <button
            type="button"
            @click="confirmCashCharge"
            :disabled="paymentLoading"
            class="btn-primary h-10! text-xs! px-4! flex items-center gap-2 font-bold cursor-pointer"
          >
            <div v-if="paymentLoading" class="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            <CheckCircle v-else class="w-4 h-4" />
            Registrar Cobro
          </button>
        </div>
      </div>
    </MoleculesBaseModal>
  </div>
</template>

<script setup lang="ts">
import {
	AlertTriangle,
	Banknote,
	Building2,
	CheckCircle,
	CheckCircle2,
	Clock,
	CreditCard,
	Mail,
	QrCode,
	RefreshCw,
	ScanLine,
	Search,
	Ticket,
	UserCheck,
	UserPlus,
} from "lucide-vue-next";
import { useToast } from "vue-toastification";

definePageMeta({
	layout: "admin",
	requiresAuth: true,
	roles: [2, 3],
});

const toast = useToast();
const gymStore = useGymStore();
const checkInStore = useCheckInStore();
const daypassStore = useDayPassStore();
const paymentStore = usePaymentStore();
const planStore = usePlanStore();

const { gymForm } = storeToRefs(gymStore);
const { checkIns, lastResult, lastError, pagination, loading } =
	storeToRefs(checkInStore);
const { dayPasses, loading: daypassLoading } = storeToRefs(daypassStore);
const { plans } = storeToRefs(planStore);
const { loading: paymentLoading } = storeToRefs(paymentStore);

const activeTab = ref<"checkin" | "daypasses">("checkin");
const validationMode = ref<"qr" | "email">("qr");
const qrSlug = ref("");
const clientEmail = ref("");
const filterDate = ref("");
const loadingCheckIns = ref(false);
const qrInputRef = ref<HTMLInputElement | null>(null);

const daypassSearch = ref("");
const showChargeModal = ref(false);
const targetPassToCharge = ref<DayPassDetail | null>(null);
const chargeMethodId = ref<1 | 2>(1);

const walkInForm = reactive({
	fullName: "",
	phone: "",
	email: "",
	planId: undefined as number | undefined,
});

const isWalkInFormValid = computed(() => {
	return (
		walkInForm.fullName.trim().length >= 2 &&
		walkInForm.phone.trim().length >= 7 &&
		walkInForm.email.includes("@") &&
		Boolean(walkInForm.planId)
	);
});

const availablePassPlans = computed(() => {
	const list = plans.value.filter((p) => p.active);
	const passes = list.filter((p) => {
		const pType = (p.planType || "").toLowerCase();
		const pName = (p.name || "").toLowerCase();
		return (
			p.duration <= 1 ||
			(p.maxVisits !== null && p.maxVisits !== undefined && p.maxVisits <= 1) ||
			pType.includes("pase") ||
			pType.includes("dia") ||
			pType.includes("daypass") ||
			pType.includes("visita") ||
			pName.includes("unico") ||
			pName.includes("pase")
		);
	});
	return passes.length > 0 ? passes : list;
});

const setValidationMode = (mode: "qr" | "email") => {
	validationMode.value = mode;
	checkInStore.clearLastResult();
	nextTick(() => {
		if (mode === "qr" && qrInputRef.value) {
			qrInputRef.value.focus();
		}
	});
};

const formatDate = (dateStr: string) => {
	if (!dateStr) return "";
	return new Date(dateStr).toLocaleDateString("es-MX", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	});
};

const formatTime = (dateStr: string) => {
	if (!dateStr) return "";
	return new Date(dateStr).toLocaleTimeString("es-MX", {
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
	});
};

const handleValidateQr = async () => {
	if (!gymForm.value.id || !qrSlug.value.trim()) return;

	const res = await checkInStore.scanAccess({
		gym_id: gymForm.value.id,
		slug: qrSlug.value.trim(),
	});

	if (res.isSuccess) {
		toast.success("¡Acceso concedido!");
		qrSlug.value = "";
		await refreshCheckIns();
	} else {
		toast.error(res.getError?.msg || "Acceso denegado");
	}
};

const handleValidateEmail = async () => {
	if (!gymForm.value.id || !clientEmail.value.trim()) return;

	const res = await checkInStore.scanAccess({
		gym_id: gymForm.value.id,
		email: clientEmail.value.trim(),
	});

	if (res.isSuccess) {
		toast.success("¡Acceso concedido!");
		clientEmail.value = "";
		await refreshCheckIns();
	} else {
		toast.error(res.getError?.msg || "Acceso denegado");
	}
};

const resetScan = () => {
	checkInStore.clearLastResult();
	qrSlug.value = "";
	clientEmail.value = "";
	nextTick(() => {
		if (validationMode.value === "qr" && qrInputRef.value) {
			qrInputRef.value.focus();
		}
	});
};

const refreshCheckIns = async () => {
	if (!gymForm.value.id) return;
	loadingCheckIns.value = true;
	try {
		await checkInStore.getCheckInsByGym(
			gymForm.value.id,
			pagination.value.page,
			pagination.value.pageSize,
			filterDate.value || undefined,
			filterDate.value || undefined,
		);
	} finally {
		loadingCheckIns.value = false;
	}
};

const applyDateFilter = async () => {
	pagination.value.page = 1;
	await refreshCheckIns();
};

const goToPage = async (page: number) => {
	pagination.value.page = page;
	await refreshCheckIns();
};

const refreshDayPasses = async () => {
	if (!gymForm.value.id) return;
	await daypassStore.getDayPassesByGym(
		gymForm.value.id,
		1,
		20,
		undefined,
		daypassSearch.value.trim() || undefined,
	);
};

const handleRegisterGuest = async () => {
	if (!gymForm.value.id || !isWalkInFormValid.value || !walkInForm.planId)
		return;

	const res = await daypassStore.registerGuest({
		gym_id: gymForm.value.id,
		plan_id: walkInForm.planId,
		full_name: walkInForm.fullName.trim(),
		phone: walkInForm.phone.trim(),
		email: walkInForm.email.trim(),
	});

	if (res.isSuccess) {
		toast.success("Invitado registrado en sistema");
		walkInForm.fullName = "";
		walkInForm.phone = "";
		walkInForm.email = "";
		await refreshDayPasses();
	} else {
		toast.error(res.getError?.msg || "Error al registrar invitado");
	}
};

const openChargeModal = (pass: DayPassDetail) => {
	targetPassToCharge.value = pass;
	chargeMethodId.value = 1;
	showChargeModal.value = true;
};

const closeChargeModal = () => {
	showChargeModal.value = false;
	targetPassToCharge.value = null;
};

const confirmCashCharge = async () => {
	if (!targetPassToCharge.value || !gymForm.value.id) return;

	const res = await paymentStore.registerCashPayment({
		gym_id: gymForm.value.id,
		payment_method_id: chargeMethodId.value,
		amount: targetPassToCharge.value.planPrice,
		day_pass_id: targetPassToCharge.value.id,
	});

	if (res.isSuccess) {
		toast.success("Pago registrado exitosamente");
		closeChargeModal();
		await refreshDayPasses();
	} else {
		toast.error(res.getError?.msg || "Error al registrar cobro en caja");
	}
};

const fastCheckInPass = async (slug: string) => {
	if (!gymForm.value.id) return;
	const res = await checkInStore.scanAccess({
		gym_id: gymForm.value.id,
		slug,
	});

	if (res.isSuccess) {
		toast.success("¡Entrada concedida al visitante!");
		await refreshDayPasses();
		await refreshCheckIns();
	} else {
		toast.error(res.getError?.msg || "Acceso denegado");
	}
};

watch(daypassSearch, () => {
	refreshDayPasses();
});

onMounted(async () => {
	if (!gymForm.value.id) {
		await gymStore.getMyGym();
	}
	if (gymForm.value.id) {
		await Promise.all([
			refreshCheckIns(),
			refreshDayPasses(),
			planStore.getPlansByGym(gymForm.value.id),
		]);
	}
});
</script>
