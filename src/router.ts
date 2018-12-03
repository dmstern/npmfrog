import Vue from 'vue';
import Router, { Route } from 'vue-router';
import Home from './views/Home.vue';
import PackageDetail from './views/PackageDetail.vue';
import HowTo from './views/HowTo.vue';

Vue.use(Router);

const appName = 'npmFrog';
const titleSuffix = ` | ${appName}`;

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        getTitle: () => {
          return appName;
        },
      },
    },
    {
      path: '/package/:scope?/:packageName',
      name: 'packageDetail',
      component: PackageDetail,
      meta: {
        getTitle: (route: Route) => {
          return `${route.params.scope ? `${route.params.scope}/` : ''}${
            route.params.packageName
          }${titleSuffix}`;
        },
      },
    },
    {
      path: '/howto/',
      name: 'howto',
      component: HowTo,
      meta: {
        getTitle: (route: Route) => {
          return `HowTo${titleSuffix}`;
        },
      },
    },
  ],
});
