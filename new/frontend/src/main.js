import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/index.css';
import VueCurrencyInput from 'vue-currency-input'

// const pluginOptions = {
//   /* see config reference */
//   globalOptions: { currency: 'BRL', locale: 'pt-BR', auto-decimal-mode: true }
// }

Vue.use(VueToast);
Vue.use(VueCurrencyInput)

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
