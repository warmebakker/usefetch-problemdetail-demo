<script setup lang="ts">
import Toaster from '@/components/Toaster.vue'
import LightDarkSwitch from '@/components/LighDarkSwich.vue'
import FetcherGetData from '@/components/GetData.vue'
import FetcherPostData from '@/components/PostData.vue'
import FetcherPutData from '@/components/PutData.vue'
import Card from 'primevue/card'
</script>

<template>
  <Toaster />
  <LightDarkSwitch class="absolute top-2 right-4" />

  <div class="pt-8 sm:mx-8 md:mx-14 lg:mx-40 xl:mx-96 2xl:mx-[500px]">
    <Card>
      <template #title>GET problem result</template>
      <template #content>
        <FetcherGetData />
      </template>
    </Card>

    <Card class="mt-5 hidden">
      <template #title>PUT with pre-get</template>
      <template #content>
        <FetcherPutData />
      </template>
    </Card>

    <Card class="mt-5">
      <template #title>POST and back to defaults</template>
      <template #content>
        <FetcherPostData />
      </template>
    </Card>
  </div>
</template>