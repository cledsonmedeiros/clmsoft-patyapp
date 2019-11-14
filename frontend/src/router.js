import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      // name: 'home',
      component: () => import(/* webpackChunkName: "home" */ './views/Home.vue'),
    },
    {
      path: '/home',
      name: 'home',
      component: () => import(/* webpackChunkName: "home" */ './views/Home.vue'),
    },
    {
      path: '*/',
      name: '404',
      component: () => import(/* webpackChunkName: "404" */ './views/404.vue'),
    },
    {
      path: '/clientes',
      name: 'clientes',
      component: () => import(/* webpackChunkName: "clientes" */ './views/Cliente/ClienteGerenciar.vue'),
    },
    {
      path: '/produtos',
      name: 'produtos',
      component: () => import(/* webpackChunkName: "produtos" */ './views/Produto/ProdutoGerenciar.vue'),
    },
    {
      path: '/donosdeprodutos',
      name: 'donosdeprodutos',
      component: () => import(/* webpackChunkName: "donosdeprodutos" */ './views/Produto/ProdutoDonoGerenciar.vue'),
    },
    {
      path: '/categoriasdeprodutos',
      name: 'categoriasdeprodutos',
      component: () => import(/* webpackChunkName: "categoriasdeprodutos" */ './views/Produto/ProdutoCategoriaGerenciar.vue'),
    },
    {
      path: '/vendas',
      name: 'vendas',
      component: () => import(/* webpackChunkName: "vendas" */ './views/Venda/VendaGerenciar.vue'),
    },
    {
      path: '/novavenda',
      name: 'novavenda',
      component: () => import(/* webpackChunkName: "novavenda" */ './views/Venda/VendaNova.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "login" */ './views/Forms/Login.vue'),
    },
  ],
});
