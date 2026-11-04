<template>
  <header
    class="h-16 px-6 md:px-8 flex items-center justify-between ml:justify-end z-30 bg-surface/90 backdrop-blur-md border-b border-surface-light">
    <button @click="$emit('toggle-sidebar')"
      class="w-10 h-10 rounded-xl flex items-center justify-center text-text-sub border border-surface-light bg-surface-light transition-colors hover:text-primary hover:border-primary/40 outline-none ml:hidden shrink-0 cursor-pointer">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.75" stroke="currentColor"
        class="w-5 h-5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
      </svg>
    </button>

    <button @click="$emit('logout')"
      class="ml-2 px-4 py-2 bg-primary hover:bg-primary-dark text-on-primary text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer">
      Cerrar sesión
    </button>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  userName: string;
  image: string;
}>();

defineEmits<{
  (e: "toggle-sidebar"): void;
  (e: "logout"): void;
}>();
</script>
