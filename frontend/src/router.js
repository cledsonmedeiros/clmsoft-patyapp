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
      path: '/clientes/pesquisar',
      name: 'clientes-pesquisar',
      component: () => import(/* webpackChunkName: "about" */ './views/Cliente/ClientePesquisar.vue'),
    },
    {
      path: '/clientes/gerenciar',
      name: 'clientes-gerenciar',
      component: () => import(/* webpackChunkName: "about" */ './views/Cliente/ClienteGerenciar.vue'),
    },
    {
      path: '/produtos/pesquisar',
      name: 'produtos-pesquisar',
      component: () => import(/* webpackChunkName: "about" */ './views/Produto/ProdutoPesquisar.vue'),
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
    {
      path: '/categoriasdeprodutos/pesquisar',
      name: 'categoriasdeprodutos-pesquisar',
      component: () => import(/* webpackChunkName: "about" */ './views/Produto/CategoriaPesquisar.vue'),
    },
    {
      path: '/categoriasdeprodutos/gerenciar',
      name: 'categoriasdeprodutos-gerenciar',
      component: () => import(/* webpackChunkName: "about" */ './views/Produto/CategoriaGerenciar.vue'),
    },
  ],
});
