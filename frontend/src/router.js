import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import(/* webpackChunkName: "about" */ './views/Home.vue'),
    },
    {
      path: '/clientes/crud',
      name: 'clientes-crud',
      component: () => import(/* webpackChunkName: "about" */ './views/Cliente/Crud.vue'),
    },
    {
      path: '/clientes/pesquisar',
      name: 'clientes-pesquisar',
      component: () => import(/* webpackChunkName: "about" */ './views/Cliente/Pesquisar.vue'),
    },
  ],
});
