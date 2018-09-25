import '@babel/polyfill';
import '@mdi/font/css/materialdesignicons.css';
import Vue from 'vue';
import './plugins/';
import App from './App.vue';
import router from './router';

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
