import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import sumor from '../../libs/index.js'
window.sumor = sumor

createApp(App).mount('#app')
