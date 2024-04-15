<script setup lang="ts">
import { computed, ref } from 'vue';
import Button from 'primevue/button';
import SelectButton from 'primevue/selectbutton';
import BlockUI from 'primevue/blockui';
import useReactiveApiFetcher from '@/utils/apiFetcher';

import toastsBus from '@/utils/toasting';

const marketApi = useReactiveApiFetcher<ExpectedResult>('/market/problemdetail')

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

const queryUrl = computed(() => {
  return `${whatProblem.value!.value}${whatProblem.value!.delay ? '?delay=true' : ''}`;
})

const fetch = async () => {
  const result = await marketApi.execute(queryUrl.value)
  if (!result.success) return;

  toastsBus.emit({
    options: {
      severity: 'info',
      summary: 'Success 👍',
      detail: ' fetched some data',
      life: 2000,
    }
  })
}
</script>

<template>
  <BlockUI :blocked="marketApi.isLoading.value" class="flex flex-col gap-4" :pt="{ mask: 'bg-surface-100 dark:bg-surface-900 opacity-40' }">
    <SelectButton v-model="whatProblem" :options="options" option-label="value" data-key="key" />
    <i class="font-mono text-sm">{{ queryUrl }}</i>
    <Button :loading="marketApi.isLoading.value" label="🤖 Run request 🐲" @click="fetch" />

    <pre v-if="marketApi.error.value" class="text-sm overflow-scroll border-2 border-orange-700  border-dashed rounded-lg px-2 pt-1">{{ marketApi.error.value }}
    </pre>

    <pre v-if="marketApi.data.value" :class="{ 'opacity-50': marketApi.error.value }" class="text-sm border-gray-500 border-2 border-dashed rounded-lg px-2 pt-1">{{ marketApi.data.value }}
    </pre>
  </BlockUI>
</template>