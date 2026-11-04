<template>
  <div
    :class="[
      'text-center p-3.5 rounded-xl border font-semibold text-xs tracking-wide my-2',
      error
        ? 'bg-error/10 text-error border-error/30'
        : 'bg-success/10 text-success border-success/30',
    ]"
  >
    {{ msg }}
  </div>
</template>

<script setup lang="ts">
defineProps<{
  error: boolean;
  msg: string;
}>();
</script>
