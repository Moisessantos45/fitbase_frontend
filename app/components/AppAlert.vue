<template>
  <div v-if="displayMessage" class="px-4 py-3 rounded-xl text-xs font-semibold border mb-4" :class="isError
      ? 'bg-error/10 text-error border-error/30'
      : 'bg-success/10 text-success border-success/30'
    ">
    {{ displayMessage }}
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  message?: string;
  msg?: string;
  type?: string;
  error?: boolean;
}>();

const displayMessage = computed(() => props.message || props.msg || "");
const isError = computed(() => props.type === "error" || props.error === true);
</script>
