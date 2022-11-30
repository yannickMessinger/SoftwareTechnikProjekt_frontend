import { createApp } from 'vue'
//import './style.css'
import App from './App.vue'
import router from "./router/router";
import * as ConfirmDialog from 'vuejs-confirm-dialog';

const app = createApp(App)
app.use(ConfirmDialog)
app.use(router).mount('#app')
