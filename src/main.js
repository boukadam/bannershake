import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import i18n from './i18n';
import CountryFlag from 'vue-country-flag';
import Notifications from 'vue-notification'

Vue.config.productionTip = false;
Vue.use(Notifications);

new Vue({
  vuetify,
  i18n,
  render: h => h(App)
}).$mount('#app');

Vue.component('country-flag', CountryFlag);
