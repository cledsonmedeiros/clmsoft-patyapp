import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/home',
    name: 'home',
    meta: {
      titulo: "Home"
    },
    component: () => import(/* webpackChunkName: "home" */ '@/views/home/Home.vue')
  },
  {
    path: '/',
    name: 'login',
    meta: {
      titulo: "Login"
    },
    component: () => import(/* webpackChunkName: "login" */ '@/views/home/Login.vue')
  },
  {
    path: '/clientes',
    name: 'clientes',
    meta: {
      titulo: "Clientes"
    },
    component: () => import(/* webpackChunkName: "clientes" */ '@/views/clientes/Clientes.vue')
  },
  {
    path: '/categorias',
    name: 'categorias',
    meta: {
      titulo: "Categorias"
    },
    component: () => import(/* webpackChunkName: "categorias" */ '@/views/categorias/Categorias.vue')
  },
  {
    path: '/produtos',
    name: 'produtos',
    meta: {
      titulo: "Produtos"
    },
    component: () => import(/* webpackChunkName: "produtos" */ '@/views/produtos/Produtos.vue')
  },
  {
    path: '/vendas',
    name: 'vendas',
    meta: {
      titulo: "Vendas"
    },
    component: () => import(/* webpackChunkName: "vendas" */ '@/views/vendas/Vendas.vue')
  },
  {
    path: '/novavenda',
    name: 'novavenda',
    meta: {
      titulo: "Nova venda"
    },
    component: () => import(/* webpackChunkName: "novavenda" */ '@/views/vendas/NovaVenda.vue')
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.titulo} - PatyApp`
  if (to.path === '/' && localStorage.userID !== undefined) {
    router.push('/home');
  }
  if (to.path !== '/' && localStorage.userID === undefined) {
    router.push('/');
  }
  next()
})

export default router
