<template>
  <input v-model="model" v-bind="$attrs" :class="inputClasses" />
</template>

<script setup lang="ts">
const model = defineModel<string | number | null | boolean>();
const attrs = useAttrs();

const inputClasses = computed(() => {
  if (attrs.type === "checkbox") {
    return "h-4 w-4 rounded-md border-surface-light bg-surface text-primary focus:ring-2 focus:ring-primary/40 transition-all cursor-pointer accent-primary";
  }
  if (attrs.type === "radio") {
    return "h-4 w-4 rounded-full border-surface-light bg-surface text-primary focus:ring-2 focus:ring-primary/40 transition-all cursor-pointer accent-primary";
  }
  return "block w-full px-4 py-3.5 border border-surface-light rounded-2xl text-sm text-white bg-surface placeholder:text-text-muted hover:border-surface-hover focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-150";
});
</script>
