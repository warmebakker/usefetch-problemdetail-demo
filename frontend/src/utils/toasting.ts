import { useEventBus, type EventBusKey } from '@vueuse/core'
import { type ToastMessageOptions } from 'primevue/toast'

const toastKey: EventBusKey<{ options: ToastMessageOptions }> = Symbol('toast-key')
const toastsBus = useEventBus(toastKey)

export default toastsBus