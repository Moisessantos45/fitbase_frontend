<template>
  <div class="min-h-screen bg-bg-base text-white flex">
    <aside
      class="hidden lg:flex w-64 bg-surface border-r border-surface-light flex-col justify-between shrink-0 sticky top-0 h-screen"
    >
      <div class="p-5">
        <div
          class="flex items-center gap-3 px-2 py-3 mb-6 border-b border-surface-light"
        >
          <div
            class="w-10 h-10 rounded-xl bg-bg-base border border-primary flex items-center justify-center text-primary"
          >
            <Shield class="w-5 h-5" />
          </div>
          <div>
            <h2 class="font-black text-sm tracking-widest text-white">
              FITBASE
            </h2>
            <p class="text-[11px] text-primary font-bold">PANEL ADMIN</p>
          </div>
        </div>

        <nav class="space-y-1">
          <p
            class="text-[11px] font-bold text-text-muted uppercase tracking-wider px-3 py-1"
          >
            ADMINISTRACIÓN
          </p>
          <NuxtLink
            to="/admin"
            class="nav-link flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition"
            :class="
              route.path === '/admin'
                ? 'text-primary bg-primary/10 border-l-2 border-primary'
                : 'text-text-sub hover:text-white hover:bg-surface-light'
            "
          >
            <LayoutDashboard class="w-4 h-4" /> Dashboard General
          </NuxtLink>
          <NuxtLink
            to="/admin/checkin"
            class="nav-link flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition"
            :class="
              route.path === '/admin/checkin'
                ? 'text-primary bg-primary/10 border-l-2 border-primary'
                : 'text-text-sub hover:text-white hover:bg-surface-light'
            "
          >
            <QrCode class="w-4 h-4" /> Control de Acceso
          </NuxtLink>
          <NuxtLink
            to="/admin/subscribers"
            class="nav-link flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition"
            :class="
              route.path === '/admin/subscribers'
                ? 'text-primary bg-primary/10 border-l-2 border-primary'
                : 'text-text-sub hover:text-white hover:bg-surface-light'
            "
          >
            <Users class="w-4 h-4" /> Suscriptores
          </NuxtLink>
          <NuxtLink
            to="/admin/plans"
            class="nav-link flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition"
            :class="
              route.path.startsWith('/admin/plans')
                ? 'text-primary bg-primary/10 border-l-2 border-primary'
                : 'text-text-sub hover:text-white hover:bg-surface-light'
            "
          >
            <Layers class="w-4 h-4" /> Gestión de Planes
          </NuxtLink>
          <NuxtLink
            to="/admin/payments"
            class="nav-link flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition"
            :class="
              route.path === '/admin/payments'
                ? 'text-primary bg-primary/10 border-l-2 border-primary'
                : 'text-text-sub hover:text-white hover:bg-surface-light'
            "
          >
            <Banknote class="w-4 h-4" /> Registro de Pagos
          </NuxtLink>
          <NuxtLink
            to="/admin/analytics"
            class="nav-link flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition"
            :class="
              route.path === '/admin/analytics'
                ? 'text-primary bg-primary/10 border-l-2 border-primary'
                : 'text-text-sub hover:text-white hover:bg-surface-light'
            "
          >
            <TrendingUp class="w-4 h-4" /> Analítica y Turnos
          </NuxtLink>
          <NuxtLink
            to="/admin/gym"
            class="nav-link flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition"
            :class="
              route.path === '/admin/gym'
                ? 'text-primary bg-primary/10 border-l-2 border-primary'
                : 'text-text-sub hover:text-white hover:bg-surface-light'
            "
          >
            <Building2 class="w-4 h-4" /> Datos del Gimnasio
          </NuxtLink>
          <NuxtLink
            to="/admin/managers"
            class="nav-link flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition"
            :class="
              route.path.startsWith('/admin/managers')
                ? 'text-primary bg-primary/10 border-l-2 border-primary'
                : 'text-text-sub hover:text-white hover:bg-surface-light'
            "
          >
            <UserCheck class="w-4 h-4" /> Encargados
          </NuxtLink>
          <NuxtLink
            to="/admin/settings"
            class="nav-link flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition"
            :class="
              route.path === '/admin/settings'
                ? 'text-primary bg-primary/10 border-l-2 border-primary'
                : 'text-text-sub hover:text-white hover:bg-surface-light'
            "
          >
            <Sliders class="w-4 h-4" /> Ajustes Admin
          </NuxtLink>

          <div class="pt-4 border-t border-surface-light mt-4">
            <p
              class="text-[11px] font-bold text-text-muted uppercase tracking-wider px-3 py-1"
            >
              CUENTA
            </p>
            <NuxtLink
              to="/profile"
              class="nav-link flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition"
              :class="
                route.path === '/profile'
                  ? 'text-primary bg-primary/10 border-l-2 border-primary'
                  : 'text-text-sub hover:text-white hover:bg-surface-light'
              "
            >
              <User class="w-4 h-4" /> Mi Perfil
            </NuxtLink>
            <NuxtLink
              to="/settings"
              class="nav-link flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition"
              :class="
                route.path === '/settings'
                  ? 'text-primary bg-primary/10 border-l-2 border-primary'
                  : 'text-text-sub hover:text-white hover:bg-surface-light'
              "
            >
              <Settings class="w-4 h-4" /> Configuración
            </NuxtLink>
          </div>
        </nav>
      </div>

      <div class="p-5 border-t border-surface-light">
        <button
          @click="logout"
          class="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-error bg-error/10 hover:bg-error/20 transition"
        >
          <LogOut class="w-4 h-4" /> Salir de Admin
        </button>
      </div>
    </aside>

    <main
      class="flex-1 max-w-300 w-full mx-auto px-4 sm:px-6 lg:px-10 py-6 pb-24 lg:pb-12 space-y-6"
    >
      <slot />
    </main>

    <nav
      class="lg:hidden fixed bottom-0 inset-x-0 bg-surface/95 backdrop-blur-lg border-t border-surface-light px-2 py-2 flex items-center justify-around z-40"
    >
      <NuxtLink
        to="/admin"
        class="flex flex-col items-center gap-1 text-[10px] font-semibold transition"
        :class="
          route.path === '/admin'
            ? 'text-primary'
            : 'text-text-sub'
        "
      >
        <LayoutDashboard class="w-5 h-5" />
        <span>Panel</span>
      </NuxtLink>
      <NuxtLink
        to="/admin/subscribers"
        class="flex flex-col items-center gap-1 text-[10px] font-semibold transition"
        :class="
          route.path === '/admin/subscribers' ? 'text-primary' : 'text-text-sub'
        "
      >
        <Users class="w-5 h-5" />
        <span>Socios</span>
      </NuxtLink>
      <NuxtLink
        to="/admin/plans"
        class="flex flex-col items-center gap-1 text-[10px] font-semibold transition"
        :class="
          route.path.startsWith('/admin/plans')
            ? 'text-primary'
            : 'text-text-sub'
        "
      >
        <Layers class="w-5 h-5" />
        <span>Planes</span>
      </NuxtLink>
      <NuxtLink
        to="/admin/payments"
        class="flex flex-col items-center gap-1 text-[10px] font-semibold transition"
        :class="
          route.path === '/admin/payments' ? 'text-primary' : 'text-text-sub'
        "
      >
        <Banknote class="w-5 h-5" />
        <span>Pagos</span>
      </NuxtLink>
      <NuxtLink
        to="/admin/gym"
        class="flex flex-col items-center gap-1 text-[10px] font-semibold transition"
        :class="route.path === '/admin/gym' ? 'text-primary' : 'text-text-sub'"
      >
        <Building2 class="w-5 h-5" />
        <span>Sede</span>
      </NuxtLink>
      <button
        @click="logout"
        class="flex flex-col items-center gap-1 text-[10px] font-semibold text-error transition cursor-pointer"
      >
        <LogOut class="w-5 h-5" />
        <span>Salir</span>
      </button>
    </nav>

    <MoleculesBaseModal
      :hidden="showCloseRegisterModal"
      title="Cierre de Turno de Caja"
      width="480px"
      confirm-label="Cerrar Caja y Salir"
      cancel-label="Cancelar"
      :disabled="closingRegister || closeCash < 0"
      @cancel="showCloseRegisterModal = false"
      @confirm="handleConfirmCloseRegister"
    >
      <div class="space-y-4">
        <div
          class="p-4 rounded-2xl bg-surface-light/40 border border-surface-light flex items-start gap-3"
        >
          <div
            class="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0"
          >
            <Banknote class="w-5 h-5" />
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-xs font-bold text-white">Turno de Caja Activo</p>
            <p class="text-[11px] text-text-sub mt-0.5">
              Ingresa el monto total en efectivo que hay en caja para cerrar el turno y finalizar sesión.
            </p>
            <div
              v-if="currentRegister"
              class="mt-2.5 flex flex-wrap gap-2 text-[10px]"
            >
              <span
                class="px-2.5 py-1 rounded-lg bg-surface border border-surface-light text-text-sub"
              >
                Fondo inicial:
                <strong class="text-white">${{ currentRegister.openCash }}</strong>
              </span>
              <span
                v-if="currentRegister.openTime"
                class="px-2.5 py-1 rounded-lg bg-surface border border-surface-light text-text-sub"
              >
                Apertura:
                <strong class="text-white">{{ currentRegister.openTime }}</strong>
              </span>
            </div>
          </div>
        </div>

        <div class="space-y-1.5">
          <label class="text-[11px] font-bold text-text-sub block">
            Monto Final en Efectivo ($) *
          </label>
          <input
            type="number"
            inputmode="decimal"
            step="any"
            min="0"
            v-model.number="closeCash"
            placeholder="0.00"
            class="input-field w-full text-xs"
            required
            @keyup.enter="handleConfirmCloseRegister"
          />
          <p class="text-[10px] text-text-muted">
            Total recaudado más fondo inicial físico en caja.
          </p>
        </div>
      </div>
    </MoleculesBaseModal>
  </div>
</template>

<script setup lang="ts">
import {
	Banknote,
	Building2,
	Layers,
	LayoutDashboard,
	LogOut,
	QrCode,
	Settings,
	Shield,
	Sliders,
	TrendingUp,
	User,
	UserCheck,
	Users,
} from "lucide-vue-next";
import { useToast } from "vue-toastification";

const toast = useToast();
const route = useRoute();
const authStore = useAuthStore();
const cashRegisterStore = useCashRegisterStore();

const { alertMessage } = storeToRefs(authStore);
const currentRegister = toRef(cashRegisterStore, "currentRegister");

const showCloseRegisterModal = ref(false);
const closeCash = ref<number>(0);
const closingRegister = ref(false);

const performLogout = async () => {
	await authStore.logout();
	await navigateTo("/login", { replace: true });
};

const logout = async () => {
	if (!authStore.authData?.roleId && !authStore.loading) {
		await authStore.getSession();
	}

	if (authStore.authData?.roleId === 3) {
		if (!currentRegister.value && !cashRegisterStore.loading) {
			await cashRegisterStore.getCurrentRegister();
		}
		if (currentRegister.value?.isOpen) {
			closeCash.value = 0;
			showCloseRegisterModal.value = true;
			return;
		}
	}

	await performLogout();
};

const handleConfirmCloseRegister = async () => {
	if (closeCash.value < 0 || Number.isNaN(Number(closeCash.value))) {
		toast.error("Por favor ingresa un monto válido en efectivo.");
		return;
	}

	closingRegister.value = true;
	const res = await cashRegisterStore.closeRegister({
		closeCash: Number(closeCash.value),
	});
	closingRegister.value = false;

	if (res.isSuccess) {
		showCloseRegisterModal.value = false;
		toast.success("Turno de caja cerrado exitosamente.");
		await performLogout();
	} else {
		toast.error(res.getError?.msg || "Error al cerrar la caja");
	}
};
</script>
