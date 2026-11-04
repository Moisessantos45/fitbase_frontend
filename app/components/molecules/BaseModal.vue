<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="hidden"
        class="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        @mousedown.self="$emit('cancel')"
      >
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

        <Transition
          enter-active-class="transition-all duration-200 ease-out"
          enter-from-class="opacity-0 scale-95 -translate-y-2"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition-all duration-150 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 -translate-y-2"
        >
          <div
            v-if="hidden"
            class="relative z-10 bg-surface border border-surface-light rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            :style="{ width: width, maxWidth: '100%', maxHeight: '90vh' }"
          >
            <div
              class="flex items-center justify-between px-6 py-4 border-b border-surface-light shrink-0"
            >
              <h2 class="text-base font-bold text-white m-0">
                {{ title }}
              </h2>
              <button
                @click="$emit('cancel')"
                class="w-8 h-8 rounded-xl flex items-center justify-center text-text-sub transition-colors hover:bg-surface-hover hover:text-white outline-none cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  class="w-4 h-4"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div class="overflow-y-auto flex-1 p-6 text-text-sub">
              <slot />
            </div>

            <div
              v-if="!hideFooter"
              class="flex items-center justify-end gap-3 px-6 py-4 border-t border-surface-light bg-card shrink-0"
            >
              <button
                @click="$emit('cancel')"
                class="px-4 py-2.5 rounded-xl text-xs font-semibold text-text-sub bg-surface-light border border-surface-light transition-colors hover:bg-surface-hover hover:text-white outline-none cursor-pointer"
              >
                {{ cancelLabel }}
              </button>
              <button
                @click="$emit('confirm')"
                :disabled="disabled"
                class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-on-primary bg-primary hover:bg-primary-dark border-none shrink-0 transition-colors disabled:opacity-50 disabled:cursor-not-allowed outline-none cursor-pointer"
              >
                {{ confirmLabel }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps({
  hidden: { type: Boolean, default: false },
  title: { type: String, default: "" },
  cancelLabel: { type: String, default: "Cancelar" },
  confirmLabel: { type: String, default: "Aceptar" },
  hideFooter: { type: Boolean, default: false },
  width: { type: String, default: "520px" },
  disabled: { type: Boolean, default: false },
});

defineEmits(["cancel", "confirm"]);
</script>
