<script setup lang="ts">
import { ref } from 'vue';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import useReactiveApiFetcher from '@/utils/apiFetcher';

const marketApi = useReactiveApiFetcher<FruitMarket>('/market')

interface FruitMarket {
  name: string;
  location: string
}

const formDefaults: FruitMarket = {
  name: '',
  location: 'the default location'
};

const formData = ref<FruitMarket>({ ...formDefaults });

const submitForm = async () => {
  const result = await marketApi.execute('', 'POST', formData.value);
  if (result.success) {
    formData.value = { ...formDefaults }; // Reset form to defaults
  }
};
</script>

<template>
  <form @submit.prevent="submitForm" class="flex flex-col gap-4">
    <input-text :disabled="marketApi.isLoading.value" type="text" v-model="formData.name" placeholder="Name" />
    <input-text :disabled="marketApi.isLoading.value" type="text" v-model="formData.location" placeholder="Location" />
    <Button type="submit" :loading="marketApi.isLoading.value" label="🐰 Post data now 🪅" />

    <pre v-if="marketApi.error.value" class="text-sm overflow-scroll border-2 border-orange-700  border-dashed rounded-lg px-2 pt-1">{{ marketApi.error }}
    </pre>

    <pre v-else-if="marketApi.data.value" class="text-sm border-gray-500 border-2 border-dashed rounded-lg px-2 pt-1">{{ marketApi.data }}
    </pre>
  </form>
</template>
