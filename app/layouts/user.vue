<template>
  <div class="min-h-screen bg-bg-base text-white flex">
    <aside
      class="hidden lg:flex w-64 bg-surface border-r border-surface-light flex-col justify-between shrink-0 sticky top-0 h-screen">
      <div class="p-5">
        <div class="flex items-center gap-3 px-2 py-3 mb-6 border-b border-surface-light">
          <div
            class="w-10 h-10 rounded-xl bg-bg-base border border-primary flex items-center justify-center text-primary">
            <Dumbbell class="w-5 h-5" />
          </div>
          <div>
            <h2 class="font-black text-sm tracking-widest text-white">
              FITBASE
            </h2>
            <p class="text-[11px] text-text-sub">Club de Alto Rendimiento</p>
          </div>
        </div>

        <nav class="space-y-1">
          <p class="text-[11px] font-bold text-text-muted uppercase tracking-wider px-3 py-1">
            PORTAL SOCIO
          </p>
          <NuxtLink to="/home"
            class="nav-link flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition" :class="route.path === '/home'
              ? 'text-primary bg-primary/10 border-l-2 border-primary'
              : 'text-text-sub hover:text-white hover:bg-surface-light'
              ">
            <Home class="w-4 h-4" /> Mi Gimnasio
          </NuxtLink>
          <NuxtLink to="/subscriptions"
            class="nav-link flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition" :class="route.path === '/subscriptions'
              ? 'text-primary bg-primary/10 border-l-2 border-primary'
              : 'text-text-sub hover:text-white hover:bg-surface-light'
              ">
            <BadgeCheck class="w-4 h-4" /> Mis Membresías
          </NuxtLink>
          <NuxtLink to="/payments"
            class="nav-link flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition" :class="route.path === '/payments'
              ? 'text-primary bg-primary/10 border-l-2 border-primary'
              : 'text-text-sub hover:text-white hover:bg-surface-light'
              ">
            <CreditCard class="w-4 h-4" /> Pagos y Recibos
          </NuxtLink>
          <NuxtLink to="/map"
            class="nav-link flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition" :class="route.path === '/map'
              ? 'text-primary bg-primary/10 border-l-2 border-primary'
              : 'text-text-sub hover:text-white hover:bg-surface-light'
              ">
            <MapIcon class="w-4 h-4" /> Sedes y Mapa
          </NuxtLink>

          <div class="pt-4 border-t border-surface-light mt-4">
            <p class="text-[11px] font-bold text-text-muted uppercase tracking-wider px-3 py-1">
              CUENTA
            </p>
            <NuxtLink to="/profile"
              class="nav-link flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition" :class="route.path === '/profile'
                ? 'text-primary bg-primary/10 border-l-2 border-primary'
                : 'text-text-sub hover:text-white hover:bg-surface-light'
                ">
              <User class="w-4 h-4" /> Mi Perfil
            </NuxtLink>
            <NuxtLink to="/settings"
              class="nav-link flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition" :class="route.path === '/settings'
                ? 'text-primary bg-primary/10 border-l-2 border-primary'
                : 'text-text-sub hover:text-white hover:bg-surface-light'
                ">
              <Settings class="w-4 h-4" /> Configuración
            </NuxtLink>
          </div>
        </nav>
      </div>

      <div class="p-5 border-t border-surface-light">
        <button @click="logout"
          class="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-error bg-error/10 hover:bg-error/20 transition">
          <LogOut class="w-4 h-4" /> Salir de Admin
        </button>
      </div>
    </aside>

    <main class="flex-1 max-w-300 w-full mx-auto px-4 sm:px-6 lg:px-10 py-6 pb-24 lg:pb-12 space-y-6">
      <slot />
    </main>

    <nav
      class="lg:hidden fixed bottom-0 inset-x-0 bg-surface/95 backdrop-blur-lg border-t border-surface-light px-2 py-2 flex items-center justify-around z-40">
      <NuxtLink to="/home" class="flex flex-col items-center gap-1 text-[10px] font-semibold transition"
        :class="route.path === '/home' ? 'text-primary' : 'text-text-sub'">
        <Home class="w-5 h-5" />
        <span>Inicio</span>
      </NuxtLink>
      <NuxtLink to="/subscriptions" class="flex flex-col items-center gap-1 text-[10px] font-semibold transition"
        :class="route.path === '/subscriptions' ? 'text-primary' : 'text-text-sub'
          ">
        <BadgeCheck class="w-5 h-5" />
        <span>Membresías</span>
      </NuxtLink>
      <NuxtLink to="/map" class="flex flex-col items-center gap-1 text-[10px] font-semibold transition"
        :class="route.path === '/map' ? 'text-primary' : 'text-text-sub'">
        <MapPin class="w-5 h-5" />
        <span>Sedes</span>
      </NuxtLink>
      <NuxtLink to="/profile" class="flex flex-col items-center gap-1 text-[10px] font-semibold transition"
        :class="route.path === '/profile' ? 'text-primary' : 'text-text-sub'">
        <User class="w-5 h-5" />
        <span>Perfil</span>
      </NuxtLink>
    </nav>
  </div>
</template>

<script setup lang="ts">
import {
	BadgeCheck,
	Calendar,
	CreditCard,
	Dumbbell,
	Home,
	LogOut,
	Map as MapIcon,
	MapPin,
	Settings,
	User,
} from "lucide-vue-next";

const route = useRoute();
const authStore = useAuthStore();
const { alertMessage } = storeToRefs(authStore);

const logout = async () => {
	await authStore.logout();
	await navigateTo("/login", { replace: true });
};
</script>
