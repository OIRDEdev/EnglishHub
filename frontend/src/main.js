import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import Router from './routes'

const pinia = createPinia()

createApp(App)
    .use(pinia)
    .use(Router)
    .mount('#app')
    