<template>
  <div class="min-h-screen bg-bg-base text-white">
    <header class="bg-surface border-b border-surface-light sticky top-0 z-10">
      <div
        class="max-w-300 w-full mx-auto px-4 sm:px-6 lg:px-10 py-4 flex items-center justify-between gap-4"
      >
        <button
          @click="goBack"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-(--color-ink-secondary) bg-surface border border-(--color-border) hover:bg-(--color-surface-alt) transition-colors cursor-pointer"
        >
          <ArrowLeft class="w-4 h-4" />
          Volver
        </button>
        <div class="w-10"></div>
      </div>
    </header>
    <slot />
  </div>
</template>

<script setup lang="ts">
const router = useRouter();

const goBack = () => {
  if (typeof window !== "undefined" && window.history.length > 1) {
    router.back();
  } else {
    router.push("/home");
  }
};
</script>
