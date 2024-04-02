<script setup lang="ts">
import { ref } from 'vue';
import { makeFetchePost } from '../utils/fetcher';
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

const formDefaults: FruitMarket = {
    name: '',
    location: 'the default location'
};

const payload = ref<FruitMarket>({ ...formDefaults });

const post = makeFetchePost<FruitMarket | null, PostReturn>(url, payload);

const submit = async () => {
    await post.execute();
    if (!post.error.value) {
        payload.value = { ...formDefaults }; // Reset form to defaults
    }
};

</script>

<template>
    <form @submit.prevent="submit" class="flex flex-col gap-4">
        <input-text :disabled="post.isFetching.value" type="text" v-model="payload.name" placeholder="Name" />
        <input-text :disabled="post.isFetching.value" type="text" v-model="payload.location" placeholder="Location" />
        <Button type="submit" :loading="post.isFetching.value" label="🐰 Post data now 🪅" />

        <pre v-if="post.error.value" class="text-sm overflow-scroll border-2 border-orange-700  border-dashed rounded-lg px-2 pt-1">
Raw error message: 
{{ post.error }}
      </pre>
        <pre v-else-if="post.data.value" class="text-sm border-gray-500 border-2 border-dashed rounded-lg px-2 pt-1">
{{ post.data.value }}
        </pre>
    </form>
</template>
