<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useColorMode } from '@vueuse/core'
import { Button } from "@/components/ui/button"

const mode = useColorMode({
  disableTransition: false,
  selector: 'html',
  attribute: 'class',
  modes: {
    light: 'light',
    dark: 'dark'
  }
})

if (mode.value == 'dark') {
  document
    .querySelector(`link[href="/stackoverflow-dark.css"]`)
    .removeAttribute("disabled");
  document
    .querySelector(`link[href="/stackoverflow-light.css"]`)
    .setAttribute("disabled", "true");
}
else {
  document
    .querySelector(`link[href="/stackoverflow-light.css"]`)
    .removeAttribute("disabled");
    document
    .querySelector(`link[href="/stackoverflow-dark.css"]`)
    .setAttribute("disabled", "true");
}

const toggleTheme = () => {
  if (mode.value == 'dark') {
    document
      .querySelector(`link[href="/stackoverflow-light.css"]`)
      .removeAttribute("disabled");
    document
      .querySelector(`link[href="/stackoverflow-dark.css"]`)
      .setAttribute("disabled", "true");
    mode.value = 'light';
  }
  else {
    document
      .querySelector(`link[href="/stackoverflow-dark.css"]`)
      .removeAttribute("disabled");
      document
      .querySelector(`link[href="/stackoverflow-light.css"]`)
      .setAttribute("disabled", "true");
    mode.value = 'dark';
  }
}

</script>

<template>
  <Button 
    variant="outline"
    size="icon"
    class="rounded-full border-2 border-muted-foreground hover:text-accent absolute top-4 right-4" 
    @click="toggleTheme"
  >
    <Icon v-if="mode === 'dark'" icon="radix-icons:moon" class="size-4 text-foreground" />
    <Icon v-else icon="radix-icons:sun" class="size-4 text-foreground" />
  </Button>
</template>