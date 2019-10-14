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
      path: '/clientes',
      name: 'clientes',
      component: () => import(/* webpackChunkName: "about" */ './views/Cliente/ClienteGerenciar.vue'),
    },
    {
      path: '/produtos',
      name: 'produtos',
      component: () => import(/* webpackChunkName: "about" */ './views/Produto/ProdutoGerenciar.vue'),
    },
    {
      path: '/donosdeprodutos',
      name: 'donosdeprodutos',
      component: () => import(/* webpackChunkName: "about" */ './views/Produto/ProdutoDonoGerenciar.vue'),
    },
    {
      path: '/categoriasdeprodutos',
      name: 'categoriasdeprodutos',
      component: () => import(/* webpackChunkName: "about" */ './views/Produto/ProdutoCategoriaGerenciar.vue'),
    },
  ],
});
