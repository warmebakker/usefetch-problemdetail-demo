// fooKey.ts
import type { EventBusKey } from '@vueuse/core'
import { ToastMessageOptions } from 'primevue/toast'

export const toastKey: EventBusKey<{ options: ToastMessageOptions }> = Symbol('toast-key')