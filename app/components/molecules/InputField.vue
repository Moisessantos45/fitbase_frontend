<template>
  <div
    :class="[
      ...resolvedWrapperClass,
      isCheckOrRadio
        ? 'flex items-center gap-2 cursor-pointer py-1'
        : 'flex flex-col gap-1.5',
    ]"
  >
    <template v-if="isCheckOrRadio">
      <AtomsBaseInput
        :id="id"
        :required="required"
        v-model="model"
        v-bind="$attrs"
      />
      <AtomsBaseLabel
        v-if="label"
        :label="label"
        :id="id"
        class="mb-0! select-none cursor-pointer text-sm font-medium text-text-sub"
      />
    </template>
    <template v-else>
      <AtomsBaseLabel v-if="label" :label="label" :id="id" />
      <AtomsBaseInput
        :id="id"
        :required="required"
        v-model="model"
        v-bind="$attrs"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
});

interface Props {
  label: string;
  id: string;
  required?: boolean;
  className?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  className: "",
  label: "",
});

const attrs = useAttrs();
const isCheckOrRadio = computed(() => attrs.type === "checkbox" || attrs.type === "radio");

const resolvedWrapperClass = computed(() =>
  Array.isArray(props.className) ? props.className : [props.className],
);

const model = defineModel<string | number | null | boolean>();
</script>
