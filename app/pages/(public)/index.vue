<template>
  <div
    class="min-h-screen bg-bg-base text-white flex flex-col items-center justify-center p-6 text-center"
  >
    <div
      class="w-18 h-18 bg-surface rounded-[22px] border-2 border-primary flex items-center justify-center shadow-lg shadow-primary/10 mb-6"
    >
      <Dumbbell class="w-9 h-9 text-primary" />
    </div>
    <h1 class="text-3xl font-black tracking-[2.5px] text-white mb-2">
      FITBASE
    </h1>
    <p class="text-sm text-text-sub max-w-sm mb-8">
      Tu centro integral de alto rendimiento. Gestiona tus membresías, sedes y
      entrenamientos.
    </p>

    <div class="w-full max-w-xs space-y-3">
      <NuxtLink to="/login" class="btn-primary"> Iniciar Sesión </NuxtLink>
      <NuxtLink to="/guest" class="btn-secondary">
        Entrar como Invitado
      </NuxtLink>
      <NuxtLink to="/register" class="btn-outlined"> Crear Cuenta </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Dumbbell } from "lucide-vue-next";

definePageMeta({
  name: "index",
  layout: "default",
});
</script>
