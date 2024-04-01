<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<template>
    <button @click="toggleDark()" class="leading-none rounded-full dark:bg-surface-700 bg-surface-0 p-1">
        <i :class="{ 'pi-moon': isDark, 'pi-sun': !isDark }" class="pi text-m text-surface-500 dark:text-surface-200"></i>
    </button>
</template>
