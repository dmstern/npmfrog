import '@babel/polyfill';
import '@mdi/font/css/materialdesignicons.css';
import Vue from 'vue';
import './plugins/vuetify';
import App from './App.vue';
import router from '@/router';
import VueSimpleSVG from 'vue-simple-svg';

Vue.config.productionTip = false;
Vue.use(VueSimpleSVG);

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
