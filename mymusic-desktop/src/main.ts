import { createApp } from 'vue'
import App from './App.vue'
import './samples/node-api'
import { createPinia, Pinia } from 'pinia'

interface PiniaWithInstall extends Pinia {
  install: any
}

createApp(App)
  .use(createPinia() as PiniaWithInstall)
  .mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*')
  })
