<template>
  <div>
    <v-toolbar flat dense color="purple darken-1">
      <v-app-bar-nav-icon dark @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="text-uppercase white--text">
        <span class="font-weight-light">Paty</span>
        <span>App</span>
      </v-toolbar-title>
      <div class="flex-grow-1"></div>
      <v-btn text="" color="white"@click="goToLogin()" >
        <v-icon left="">mdi-reply</v-icon>
        <span>Sair</span>
      </v-btn>
    </v-toolbar>

    <v-navigation-drawer v-model="drawer" absolute temporary>
      <v-list-item>
        <span class="font-weight-light">Paty</span>
        <span>App</span>
        <div class="flex-grow-1"></div>
        <span>Menu</span>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense rounded="">

        <v-list-item-group v-for="rota in rotas" :key="rota.titulo" link>
          <v-list-item :to="rota.link">
            <v-list-item-icon>
              <v-icon>{{ rota.icone }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ rota.titulo }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>

      </v-list>
    </v-navigation-drawer>

  </div>
</template>

<script>
export default {
  name: "NavBar",
  methods:{
    goToLogin: function(){
      this.$router.push('/login');
    }
  },
  data() {
    return {
      drawer: null,
      rotas: [
        {
          titulo: "Home",
          icone: "mdi-home",
          link: "/"
        },
        {
          titulo: "Clientes",
          icone: "mdi-account-group",
          link: "/clientes"
        },
        {
          titulo: "Produtos",
          icone: "mdi-view-dashboard",
          link: "/produtos"
        },
        {
          titulo: "Donos de produto",
          icone: "mdi-account-tie",
          link: "/donosdeprodutos"
        },
        {
          titulo: "Categorias de produto",
          icone: "mdi-format-list-bulleted-type",
          link: "/categoriasdeprodutos"
        },
        {
          titulo: "Vendas",
          icone: "mdi-currency-brl",
          link: "/vendas"
        },
        {
          titulo: "Nova venda",
          icone: "mdi-shopify",
          link: "/novavenda"
        },
        {
          titulo: "Relatórios",
          icone: "mdi-file-chart",
          link: "/relatorios"
        },
      ]
    };
  }
};
</script>
