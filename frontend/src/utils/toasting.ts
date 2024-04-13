import { toastKey } from '@/utils/event-keys'
import { useEventBus } from '@vueuse/core'

const toastsBus = useEventBus(toastKey)

export default toastsBus