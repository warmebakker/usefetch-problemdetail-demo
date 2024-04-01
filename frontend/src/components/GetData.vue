<script setup lang="ts">
import { computed, ref } from 'vue';
import { makeFetcherGetJson } from '../utils/fetcher';
import Button from 'primevue/button';
import SelectButton from 'primevue/selectbutton';
import BlockUI from 'primevue/blockui';

const baseUrl: string = 'https://localhost:7107/market/problemdetail'

interface ExpectedResult {
    description: string;
    number: number;
}

interface ProblemRequest {
    key: number;
    value: string;
    delay?: boolean;
}

const whatProblem = ref<ProblemRequest>({ key: 1, value: 'ok' })
const options = ref<ProblemRequest[]>([
    { key: 1, value: 'ok' },
    { key: 2, value: 'problem' },
    { key: 4, value: 'notfound' },
    { key: 5, value: 'notfoundjson' },
    { key: 6, value: 'nocontent' },
    { key: 7, value: 'validation' },
    { key: 8, value: 'empty' },
    { key: 9, value: 'exception', delay: true },
    { key: 10, value: 'unautherized' },
    { key: 12, value: 'slow-ok', delay: true },
]);

const url = computed(() => {
    return `${baseUrl}/${whatProblem.value!.value}${whatProblem.value!.delay ? '?delay=true' : ''}`;
})

const fetchGet = makeFetcherGetJson<ExpectedResult>(url, [204, 404])

const fetch = () => {
    fetchGet.execute();
}

</script>

<template>
    <BlockUI :blocked="fetchGet.isFetching.value" class="flex flex-col gap-4" :pt="{ mask: 'bg-surface-100 dark:bg-surface-900 opacity-40' }">
        <SelectButton v-model="whatProblem" :options="options" optionLabel="value" dataKey="key" />
        <i class="font-mono text-sm">{{ url }}</i>
        <Button :loading="fetchGet.isFetching.value" @click="fetch" label="🤖 Run request 🐲" />

        <pre v-if="fetchGet.error.value" class="text-sm overflow-scroll border-2 border-orange-700  border-dashed rounded-lg px-2 pt-1">
Raw error message: 
{{ fetchGet.error }}
        </pre>

        <pre v-if="fetchGet.data.value" :class="{ 'opacity-50': fetchGet.error.value }" class="text-sm border-gray-500 border-2 border-dashed rounded-lg px-2 pt-1">
{{ fetchGet.data.value }}
        </pre>
    </BlockUI>
</template>