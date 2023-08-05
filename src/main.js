import { createApp } from 'vue'
import App from './App.vue';
import router from './router';
import store from './store';
import VueCookies from 'vue-cookies';
import ViewUIPlus from 'view-ui-plus';
import 'view-ui-plus/dist/styles/viewuiplus.css';

const app = createApp(App);

app.use(store);
app.use(router);
app.use(VueCookies);
app.use(ViewUIPlus);

app.mount('#app');
