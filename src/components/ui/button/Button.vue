<script setup>
import { cn } from "@/lib/utils";
import { buttonVariants } from ".";
import { computed } from "vue";

const props = defineProps({
  variant: { type: null, required: false },
  size: { type: null, required: false },
  class: { type: null, required: false },
  asChild: { type: Boolean, required: false },
  as: { type: null, required: false, default: "button" },
});

const buttonClasses = computed(() => {
  const variantClasses = buttonVariants({ variant: props.variant, size: props.size });
  const finalClasses = cn(variantClasses, props.class);
  
  return finalClasses;
});
</script>

<template>
  <button
    :class="buttonClasses"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>
