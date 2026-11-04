<template>
  <label
    class="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-xl border border-surface-light bg-surface text-text-sub hover:text-primary hover:border-primary/50 hover:bg-surface-hover cursor-pointer transition-all">
    <Upload class="w-3.5 h-3.5" /> {{ label }}
    <input type="file" class="hidden" />
  </label>
</template>

<script setup lang="ts">
import { Upload } from "lucide-vue-next";
defineProps<{ label: string }>();
</script>
