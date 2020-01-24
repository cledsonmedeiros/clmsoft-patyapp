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
    path: '/categoriaproduto',
    name: 'categoriaproduto',
    meta: {
      titulo: "Categorias de Produto"
    },
    component: () => import(/* webpackChunkName: "categoriaproduto" */ '@/views/categoriaproduto/CategoriaProduto.vue')
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
  next()
})

export default router
