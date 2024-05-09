import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import demo from '../../libs/demo.js'

import sumor from '../../libs/index.js'
window.demo = demo
window.sumor = sumor

createApp(App).mount('#app')
