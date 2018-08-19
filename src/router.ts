import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import PackageDetail from './views/PackageDetail.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/package/:scope?/:packageName',
      name: 'packageDetail',
      component: PackageDetail,
    },
  ],
});
