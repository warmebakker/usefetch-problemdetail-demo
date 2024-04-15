<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import Toast from 'primevue/toast';
import { type ToastMessageOptions } from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import toastsBus from '@/utils/toasting';

const toast = useToast();
const addToast = (options: ToastMessageOptions) => toast.add(options);

onMounted(() => toastsBus.on((e) => addToast(e.options)))
onUnmounted(() => toastsBus.off((e) => addToast(e.options)))
</script>

<template>
  <Toast />
</template>