<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-white">Ajustes Administrativos</h1>
      <p class="text-sm text-text-sub mt-1">
        Configuración global del sistema y seguridad
      </p>
    </div>

    <div
      class="bg-surface border border-surface-light rounded-3xl divide-y divide-surface-light overflow-hidden"
    >
      <div class="p-5 flex items-center justify-between gap-4">
        <div>
          <h2 class="text-sm font-bold text-white">Alertas de Aforo Máximo</h2>
          <p class="text-xs text-text-sub mt-0.5">
            Notificar al personal cuando el club alcance el 85% de capacidad
          </p>
        </div>
        <input
          type="checkbox"
          v-model="adminSettings.capacityAlerts"
          class="w-5 h-5 accent-primary cursor-pointer"
        />
      </div>

      <div class="p-5 flex items-center justify-between gap-4">
        <div>
          <h2 class="text-sm font-bold text-white">
            Cobro y Renovación Automática
          </h2>
          <p class="text-xs text-text-sub mt-0.5">
            Intentar cobro a tarjetas guardadas a la medianoche del vencimiento
          </p>
        </div>
        <input
          type="checkbox"
          v-model="adminSettings.autoRenew"
          class="w-5 h-5 accent-primary cursor-pointer"
        />
      </div>

      <div class="p-5 flex items-center justify-between gap-4">
        <div>
          <h2 class="text-sm font-bold text-white">
            Modo Mantenimiento en Torniquetes
          </h2>
          <p class="text-xs text-text-sub mt-0.5">
            Permitir paso libre temporal por fallas de conexión
          </p>
        </div>
        <input
          type="checkbox"
          v-model="adminSettings.maintenanceMode"
          class="w-5 h-5 accent-primary cursor-pointer"
        />
      </div>

      <div class="p-5 flex items-center justify-between gap-4">
        <div>
          <h2 class="text-sm font-bold text-white">Registro Público Abierto</h2>
          <p class="text-xs text-text-sub mt-0.5">
            Habilitar creación de nuevas cuentas desde la app y portal web
          </p>
        </div>
        <input
          type="checkbox"
          v-model="adminSettings.publicRegistration"
          class="w-5 h-5 accent-primary cursor-pointer"
        />
      </div>
    </div>

    <div
      class="bg-surface border border-surface-light rounded-3xl p-5 space-y-4"
    >
      <h2 class="text-sm font-bold text-white">Seguridad y Respaldo</h2>
      <div class="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          @click="actionNotice('Copia de respaldo generada con éxito')"
          class="btn-secondary h-12! text-xs! flex-1"
        >
          <Database class="w-4 h-4 text-primary" /> Generar Respaldo
        </button>
        <button
          type="button"
          @click="actionNotice('Descargando auditoría de accesos...')"
          class="btn-secondary h-12! text-xs! flex-1"
        >
          <FileText class="w-4 h-4 text-primary" /> Auditoría de Accesos
        </button>
      </div>
    </div>
    <div
      v-if="noticeMsg"
      class="fixed bottom-6 right-6 z-50 bg-success text-on-primary px-4 py-2 rounded-xl text-xs font-bold shadow-lg"
    >
      {{ noticeMsg }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { Database, FileText, LogOut } from "lucide-vue-next";

definePageMeta({
  name: "admin-settings",
  layout: "admin",
  requiresAuth: true,
  roles: [2, 3],
});

const adminSettings = ref({
  capacityAlerts: true,
  autoRenew: true,
  maintenanceMode: false,
  publicRegistration: true,
});

const noticeMsg = ref("");

const actionNotice = (msg: string) => {
  noticeMsg.value = msg;
  setTimeout(() => {
    noticeMsg.value = "";
  }, 2500);
};
</script>
