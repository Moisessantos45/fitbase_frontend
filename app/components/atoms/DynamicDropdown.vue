<template>
  <div class="relative w-full text-left">
    <button
      ref="buttonRef"
      @click="toggleDropdown"
      type="button"
      :disabled="disabled"
      :class="[
        'w-full inline-flex items-center justify-between gap-2 px-3.5 py-2.5 text-sm font-medium border border-surface-light bg-surface text-white transition-all duration-200 font-inter',
        roundedClass,
        disabled
          ? 'opacity-50 cursor-not-allowed'
          : 'cursor-pointer hover:bg-surface-hover hover:border-surface-hover focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary',
      ]"
    >
      <div class="flex items-center gap-2 min-w-0">
        <component
          :is="icon"
          v-if="icon"
          :size="14"
          class="text-text-sub shrink-0"
        />
        <span class="truncate">{{ currentOption?.label || defaultLabel }}</span>
      </div>
      <ChevronDown
        :size="14"
        class="text-text-sub transition-transform duration-200 shrink-0"
        :class="{ 'rotate-180': isOpen }"
      />
    </button>

    <Teleport to="body">
      <div
        v-if="isOpen"
        ref="dropdownRef"
        class="fixed mt-1.5 min-w-32 bg-surface border border-surface-light rounded-xl shadow-2xl py-1.5 z-[10000] animate-fade-in max-h-60 overflow-y-auto font-inter backdrop-blur-md"
        :style="dropdownStyle"
      >
        <button
          v-for="option in options"
          :key="option.id"
          type="button"
          @click="selectOption(option)"
          class="w-full text-left px-3.5 py-2 text-xs transition-colors flex items-center gap-2 cursor-pointer hover:bg-surface-hover"
          :class="
            modelValue === option.id
              ? 'bg-primary/10 text-primary font-semibold'
              : 'text-text-sub hover:text-white'
          "
        >
          <span>
            {{ option.label }}
          </span>
        </button>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ChevronDown } from "lucide-vue-next";
import type { DropdownOption } from "@/entities/index";

const props = withDefaults(
	defineProps<{
		modelValue: string | number | null | undefined;
		options: DropdownOption[];
		disabled?: boolean;
		defaultLabel?: string;
		icon?: Component;
		align?: "left" | "right";
		roundedClass?: string;
	}>(),
	{
		defaultLabel: "Seleccionar...",
		disabled: false,
		align: "left",
		roundedClass: "rounded-xl",
	},
);

const emit = defineEmits<{
	(e: "update:modelValue", value: string | number): void;
	(e: "change", value: string | number): void;
}>();

const isOpen = ref(false);
const buttonRef = ref<HTMLElement | null>(null);
const dropdownRef = ref<HTMLElement | null>(null);
const dropdownStyle = ref({
	top: "0px",
	left: "auto",
	right: "auto",
	width: "auto",
});

const currentOption = computed(() =>
	props.options.find((o) => o.id === props?.modelValue),
);

const selectOption = (option: DropdownOption) => {
	isOpen.value = false;
	emit("update:modelValue", option.id);
	emit("change", option.id);
};

const toggleDropdown = () => {
	if (props.disabled) return;

	if (!isOpen.value) {
		const rect = buttonRef.value?.getBoundingClientRect();
		if (rect) {
			if (props.align === "right") {
				dropdownStyle.value = {
					top: `${rect.bottom + 6}px`,
					right: `${window.innerWidth - rect.right}px`,
					left: "auto",
					width: `${rect.width}px`,
				};
			} else {
				dropdownStyle.value = {
					top: `${rect.bottom + 6}px`,
					left: `${rect.left}px`,
					right: "auto",
					width: `${rect.width}px`,
				};
			}
		}
	}
	isOpen.value = !isOpen.value;
};

const handleClickOutside = (event: MouseEvent) => {
	if (!isOpen.value) return;

	const target = event.target as Node;
	const clickedInsideButton = buttonRef.value?.contains(target);
	const clickedInsideDropdown = dropdownRef.value?.contains(target);

	if (!clickedInsideButton && !clickedInsideDropdown) {
		isOpen.value = false;
	}
};

onMounted(() => {
	document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
	document.removeEventListener("click", handleClickOutside);
});
</script>
