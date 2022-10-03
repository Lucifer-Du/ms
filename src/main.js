import { createApp } from 'vue'
import App from './App.vue';
import router from './router';
import store from './store';
// import axios from 'axios';
import VueCookies from 'vue-cookies';
import ViewUIPlus from 'view-ui-plus';
import 'view-ui-plus/dist/styles/viewuiplus.css';

const app = createApp(App);

// app.provide('$axios', axios);
// app.provide('$router', router);
// app.provide('$cookies', VueCookies);

app.use(store);
app.use(router);
app.use(ViewUIPlus);
app.use(VueCookies);
app.mount('#app');
