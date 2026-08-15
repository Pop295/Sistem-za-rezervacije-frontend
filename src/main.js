import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')

//createPinia() i app.use(createPinia()) — omogućava Pinia store-ove (useAuthStore() neće raditi bez ovoga, baciće grešku)
//import router from './router' i app.use(router) — aktivira routing (<router-view /> u DefaultLayout.vue neće raditi bez ovoga)