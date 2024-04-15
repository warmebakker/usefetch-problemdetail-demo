<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'
import { Icon } from '@iconify/vue';

const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<template>
  <button class="leading-none rounded-full dark:bg-surface-700 bg-surface-0 p-1" @click="toggleDark()">
    <Icon v-if="isDark" icon="material-symbols:light-mode-outline-rounded" class="dark:text-surface-200" />
    <Icon v-else icon="material-symbols:dark-mode-outline-rounded" class="text-surface-500" />
  </button>
</template>
