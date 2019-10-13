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
      path: '/clientes/gerenciar',
      name: 'clientes-gerenciar',
      component: () => import(/* webpackChunkName: "about" */ './views/Cliente/Gerenciar.vue'),
    },
    {
      path: '/clientes/pesquisar',
      name: 'clientes-pesquisar',
      component: () => import(/* webpackChunkName: "about" */ './views/Cliente/Pesquisar.vue'),
    },
    {
      path: '/donosdeprodutos/pesquisar',
      name: 'donosdeprodutos-pesquisar',
      component: () => import(/* webpackChunkName: "about" */ './views/Produto/DonoPesquisar.vue'),
    },
    {
      path: '/donosdeprodutos/gerenciar',
      name: 'donosdeprodutos-gerenciar',
      component: () => import(/* webpackChunkName: "about" */ './views/Produto/DonoGerenciar.vue'),
    },
  ],
});
