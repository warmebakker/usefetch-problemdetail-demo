<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { Subscription } from '../utils/event-bus';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

onUnmounted(() => {
    Subscription.off('toast', toast.add);
});

onMounted(() => {
    Subscription.on('toast', toast.add);
});
</script>

<template>
    <Toast />
</template>