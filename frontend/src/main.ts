import { createApp } from "vue";
import "./style.css"
import App from "./App.vue"
import PrimeVue from "primevue/config"
import ToastService from 'primevue/toastservice'
import Lara from "./presets/lara"

const app = createApp(App)
app.use(PrimeVue, { unstyled: true, pt: Lara })
app.use(ToastService)
app.mount("#app")