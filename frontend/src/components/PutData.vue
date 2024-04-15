<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import useReactiveApiFetcher from '@/utils/apiFetcher';

const marketApi = useReactiveApiFetcher<FruitMarket>('/market')

interface FruitMarket {
  name: string;
  location: string
}

const formData = ref<FruitMarket>({} as FruitMarket);

const formSubmit = async () => {
  await marketApi.execute('', 'PUT', formData.value);
};

onMounted(async () => {
  var result = await marketApi.execute('/0CCB2598-CA6D-48CF-A78D-45CD04044CE0', 'GET');
  if (result.success)
    formData.value = { ...result.data } as FruitMarket;
});
</script>

<template>
  <form class="flex flex-col gap-4" @submit.prevent="formSubmit">
    <input-text v-model="formData.name" :disabled="marketApi.isLoading.value" type="text" placeholder="Name" />
    <input-text v-model="formData.location" :disabled="marketApi.isLoading.value" type="text" placeholder="Location" />
    <Button type="submit" :loading="marketApi.isLoading.value" label="🐰 Put data now 🪅" />

    <pre v-if="marketApi.error.value" class="text-sm overflow-scroll border-2 border-orange-700 border-dashed rounded-lg px-2 pt-1">{{ marketApi.error }}
    </pre>

    <pre v-else-if="marketApi.data.value" class="text-sm border-gray-500 border-2 border-dashed rounded-lg px-2 pt-1">{{ marketApi.data }}
    </pre>
  </form>
</template>
