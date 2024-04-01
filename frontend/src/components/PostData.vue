<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import { makeFetchePost } from '../utils/fetcher';
import { makeFetcherGetJson } from '../utils/fetcher';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';

const url: string = 'https://localhost:7107/market/';

interface FruitMarket {
    name: string;
    location: string
}

interface PostReturn {
    status: string;
    key: string;
}

const payload = ref<FruitMarket>({
    name: 'Some default value',
    location: 'Initial default'
});

const get = makeFetcherGetJson<FruitMarket>(url + '0CCB2598-CA6D-48CF-A78D-45CD04044CE0');
const post = makeFetchePost<FruitMarket | null, PostReturn>(url, payload);

const submit = () => {
    post.execute();
}

onMounted(async () => {
    await get.execute();
    if (get.data.value !== null)
        payload.value = get.data.value;
});

const isFetchingAny = computed(() => {
    return get.isFetching.value || post.isFetching.value;
});
</script>

<template>
    <div class="flex flex-col gap-4">
        <input-text :disabled="isFetchingAny" type="text" v-model="payload.name" placeholder="Name" />
        <input-text :disabled="isFetchingAny" type="text" v-model="payload.location" placeholder="Location" />
        <Button :loading="isFetchingAny" @click="submit" label="🐰 Post data now 🪅" />

        <pre v-if="post.error.value" class="text-sm overflow-scroll border-2 border-orange-700  border-dashed rounded-lg px-2 pt-1">
Raw error message: 
{{ post.error }}
      </pre>
        <pre v-else-if="post.data.value" class="text-sm border-gray-500 border-2 border-dashed rounded-lg px-2 pt-1">
{{ post.data.value }}
        </pre>
    </div>
</template>
