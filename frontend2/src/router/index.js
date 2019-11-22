import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    meta: {
      title: "Início",
      icon: "mdi-home",
    },
    component: () => import(/* webpackChunkName: "home" */ '../views/home/Home.vue')
  },
  {
    path: '/about',
    name: 'about',
    meta: {
      title: "Sobre",
      icon: "mdi-help",
    },
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/clientes',
    name: 'clientes',
    meta: {
      title: "Clientes",
      icon: "mdi-account-group",
    },
    component: () => import(/* webpackChunkName: "clientes" */ '../views/clientes/Clientes.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
