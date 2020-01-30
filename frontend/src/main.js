import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/index.css';
import VueCurrencyInput from 'vue-currency-input'

Vue.use(VueToast);
Vue.use(VueCurrencyInput)
Vue.use(require('vue-moment'));

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
