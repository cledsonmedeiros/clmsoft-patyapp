import Vue from 'vue';
import VueToast from 'vue-toast-notification';
import VueMoment from 'vue-moment';
import moment from 'moment-timezone';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';

import 'vue-toast-notification/dist/index.css';
import './modules/vuetify-money';


Vue.use(VueMoment, {
  moment,
});

Vue.use(VueToast);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app');
