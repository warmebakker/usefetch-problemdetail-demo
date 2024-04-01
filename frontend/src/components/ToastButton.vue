<template>
    <button @click="addToast('a message')" class="font-thin dark:text-surface-900 text-surface-100 bg-pink-500 rounded px-3 mb-2">
        Toast
    </button>
</template>

<script lang="ts">
export default {
    methods: {
        addToast(message: string) {
            this.$toast.add({
                severity: 'info',
                summary: 'Info',
                detail: message,
                life: 4000
            });
        }
    }
}
</script>