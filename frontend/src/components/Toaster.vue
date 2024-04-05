<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import Toast, { ToastMessageOptions } from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { useEventBus } from '@vueuse/core'
import { toastKey } from '@/utils/event-keys';

const toastsBus = useEventBus(toastKey);
const toast = useToast();
const addToast = (options: ToastMessageOptions) => toast.add(options);

onMounted(() => toastsBus.on((e) => addToast(e.options)))
onUnmounted(() => toastsBus.off((e) => addToast(e.options)))
</script>

<template>
    <Toast />
</template>