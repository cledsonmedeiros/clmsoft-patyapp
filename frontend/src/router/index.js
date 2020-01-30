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
    component: () => import(/* webpackChunkName: "home" */ '@/views/home/Home.vue'),
    beforeEnter (to, from, next) {
      if (localStorage.userID === undefined || localStorage.userID.length !== 24) {
        next({
          name: "login"
        });
      } else {
        next();
      }
    }
  },
  {
    path: '/',
    name: 'login',
    meta: {
      titulo: "Login"
    },
    component: () => import(/* webpackChunkName: "login" */ '@/views/home/Login.vue'),
    beforeEnter (to, from, next) {
      // console.log(from)
      if (localStorage.userID !== undefined && localStorage.userID.length === 24) {
        next({
          name: from.name
        });
      } else {
        next();
      }
    }
  },
  {
    path: '/clientes',
    name: 'clientes',
    meta: {
      titulo: "Clientes"
    },
    component: () => import(/* webpackChunkName: "clientes" */ '@/views/clientes/Clientes.vue'),
    beforeEnter (to, from, next) {
      if (localStorage.userID === undefined || localStorage.userID.length !== 24) {
        next({
          name: "login"
        });
      } else {
        next();
      }
    }
  },
  {
    path: '/categorias',
    name: 'categorias',
    meta: {
      titulo: "Categorias"
    },
    component: () => import(/* webpackChunkName: "categorias" */ '@/views/categorias/Categorias.vue'),
    beforeEnter (to, from, next) {
      if (localStorage.userID === undefined || localStorage.userID.length !== 24) {
        next({
          name: "login"
        });
      } else {
        next();
      }
    }
  },
  {
    path: '/produtos',
    name: 'produtos',
    meta: {
      titulo: "Produtos"
    },
    component: () => import(/* webpackChunkName: "produtos" */ '@/views/produtos/Produtos.vue'),
    beforeEnter (to, from, next) {
      if (localStorage.userID === undefined || localStorage.userID.length !== 24) {
        next({
          name: "login"
        });
      } else {
        next();
      }
    }
  },
  {
    path: '/vendas',
    name: 'vendas',
    meta: {
      titulo: "Vendas"
    },
    component: () => import(/* webpackChunkName: "vendas" */ '@/views/vendas/Vendas.vue'),
    beforeEnter (to, from, next) {
      if (localStorage.userID === undefined || localStorage.userID.length !== 24) {
        next({
          name: "login"
        });
      } else {
        next();
      }
    }
  },
  {
    path: '/novavenda',
    name: 'novavenda',
    meta: {
      titulo: "Nova venda"
    },
    component: () => import(/* webpackChunkName: "novavenda" */ '@/views/vendas/NovaVenda.vue'),
    beforeEnter (to, from, next) {
      if (localStorage.userID === undefined || localStorage.userID.length !== 24) {
        next({
          name: "login"
        });
      } else {
        next();
      }
    }
  },
  {
    path: '/usuarios',
    name: 'usuarios',
    meta: {
      titulo: "Usuários"
    },
    component: () => import(/* webpackChunkName: "usuarios" */ '@/views/usuarios/Usuarios.vue'),
    beforeEnter (to, from, next) {
      if ((localStorage.userID === undefined || localStorage.userID.length !== 24)) {
        next({
          name: "login"
        });
      } else {
        if (localStorage.userUsername === 'admin') {
          next();
        } else {
          next({
            name: from.name
          });
        }
      }
    }
  }
]

const router = new VueRouter({
  routes
})

router.beforeResolve((to, from, next) => {
  document.title = `${to.meta.titulo} - PatyApp`
  next()
})

export default router
