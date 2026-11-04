<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-white">Configuración</h1>
      <p class="text-sm text-text-sub mt-1">
        Preferencias de cuenta, notificaciones y privacidad
      </p>
    </div>

    <div class="space-y-4">
      <div
        class="bg-surface border border-surface-light rounded-3xl divide-y divide-surface-light overflow-hidden"
      >
        <div class="p-5 flex items-center justify-between gap-4">
          <div>
            <h2 class="text-sm font-bold text-white">Notificaciones Push</h2>
            <p class="text-xs text-text-sub mt-0.5">
              Alertas de horarios de clases y recordatorios de entreno
            </p>
          </div>
          <input
            type="checkbox"
            v-model="settings.pushNotifications"
            class="w-5 h-5 accent-primary cursor-pointer"
          />
        </div>

        <div class="p-5 flex items-center justify-between gap-4">
          <div>
            <h2 class="text-sm font-bold text-white">Acceso Biométrico</h2>
            <p class="text-xs text-text-sub mt-0.5">
              Iniciar sesión rápidamente con huella digital o Face ID
            </p>
          </div>
          <input
            type="checkbox"
            v-model="settings.biometric"
            class="w-5 h-5 accent-primary cursor-pointer"
          />
        </div>

        <div class="p-5 flex items-center justify-between gap-4">
          <div>
            <h2 class="text-sm font-bold text-white">Renovación Automática</h2>
            <p class="text-xs text-text-sub mt-0.5">
              Cargo recurrente a tu tarjeta al finalizar el periodo
            </p>
          </div>
          <input
            type="checkbox"
            v-model="settings.autoRenew"
            class="w-5 h-5 accent-primary cursor-pointer"
          />
        </div>
      </div>

      <div
        class="bg-surface border border-surface-light rounded-3xl divide-y divide-surface-light overflow-hidden"
      >
        <NuxtLink
          to="/forgot-password"
          class="w-full p-4 flex items-center justify-between hover:bg-surface-light/40 transition text-left"
        >
          <span
            class="text-sm font-semibold text-white flex items-center gap-3"
          >
            <Lock class="w-4 h-4 text-text-sub" /> Cambiar Contraseña
          </span>
          <ChevronRight class="w-4 h-4 text-text-sub" />
        </NuxtLink>

        <NuxtLink
          to="/payments"
          class="w-full p-4 flex items-center justify-between hover:bg-surface-light/40 transition text-left"
        >
          <span
            class="text-sm font-semibold text-white flex items-center gap-3"
          >
            <CreditCard class="w-4 h-4 text-text-sub" /> Métodos de Pago
            Guardados
          </span>
          <ChevronRight class="w-4 h-4 text-text-sub" />
        </NuxtLink>

        <button
          type="button"
          @click="
            openModal(
              'Términos y Condiciones',
              'Estos son los términos de servicio para los miembros de Fitbase. El acceso a las instalaciones requiere portar el código QR digital activo.',
            )
          "
          class="w-full p-4 flex items-center justify-between hover:bg-surface-light/40 transition text-left"
        >
          <span
            class="text-sm font-semibold text-white flex items-center gap-3"
          >
            <FileText class="w-4 h-4 text-text-sub" /> Términos y Condiciones
          </span>
          <ChevronRight class="w-4 h-4 text-text-sub" />
        </button>

        <button
          type="button"
          @click="
            openModal(
              'Política de Privacidad',
              'En Fitbase respetamos y protegemos tus datos personales conforme a las leyes de protección de datos aplicables.',
            )
          "
          class="w-full p-4 flex items-center justify-between hover:bg-surface-light/40 transition text-left"
        >
          <span
            class="text-sm font-semibold text-white flex items-center gap-3"
          >
            <Shield class="w-4 h-4 text-text-sub" /> Política de Privacidad
          </span>
          <ChevronRight class="w-4 h-4 text-text-sub" />
        </button>

        <button
          type="button"
          @click="
            openModal(
              'Ayuda y Soporte',
              'Comunícate con nuestro equipo de atención en soporte@fitbase.com o al +52 55 1234 5678.',
            )
          "
          class="w-full p-4 flex items-center justify-between hover:bg-surface-light/40 transition text-left"
        >
          <span
            class="text-sm font-semibold text-white flex items-center gap-3"
          >
            <HelpCircle class="w-4 h-4 text-text-sub" /> Ayuda y Soporte
          </span>
          <ChevronRight class="w-4 h-4 text-text-sub" />
        </button>
      </div>

      <div class="text-center py-6 text-xs text-text-muted">
        Fitbase Web Application • Versión 1.0.0
      </div>
    </div>

    <div
      v-if="modalInfo.open"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
    >
      <div
        class="bg-surface border border-surface-light rounded-3xl w-full max-w-md p-6 space-y-4"
      >
        <div
          class="flex justify-between items-center pb-2 border-b border-surface-light"
        >
          <h3 class="text-lg font-bold text-white">{{ modalInfo.title }}</h3>
          <button
            type="button"
            @click="modalInfo.open = false"
            class="p-1 rounded-xl text-text-sub hover:text-white"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <p class="text-xs text-text-sub leading-relaxed">
          {{ modalInfo.body }}
        </p>

        <div class="pt-2">
          <button
            type="button"
            @click="modalInfo.open = false"
            class="btn-secondary h-11! text-xs! w-full"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Lock,
  CreditCard,
  FileText,
  Shield,
  HelpCircle,
  ChevronRight,
  X,
} from "lucide-vue-next";

definePageMeta({
  name: "settings",
  layout: "user",
  requiresAuth: true,
  roles: [4],
});

const settings = ref({
  pushNotifications: true,
  biometric: false,
  autoRenew: true,
});

const modalInfo = ref({
  open: false,
  title: "",
  body: "",
});

const openModal = (title: string, body: string) => {
  modalInfo.value = { open: true, title, body };
};
</script>
