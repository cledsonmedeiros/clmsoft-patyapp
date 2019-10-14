<template>
  <div>
    <v-toolbar flat="" color="purple darken-1">
      <v-app-bar-nav-icon dark @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="text-uppercase white--text">
        <span class="font-weight-light">Paty</span>
        <span>App</span>
      </v-toolbar-title>
      <div class="flex-grow-1"></div>
      <v-btn text="" color="white">
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

        <v-list-item-group v-for="item in itens" :key="item.titulo" link>
          <v-list-item :to="item.rota">
            <v-list-item-icon>
              <v-icon>{{ item.icone }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ item.titulo }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>

      </v-list>
    </v-navigation-drawer>

  </div>
</template>

<script>
export default {
  data() {
    return {
      drawer: null,
      itens: [
        {
          titulo: "Home",
          icone: "mdi-home",
          rota: "/"
        },
        {
          titulo: "Clientes",
          icone: "mdi-account-group",
          rota: "/clientes"
        },
        {
          titulo: "Produtos",
          icone: "mdi-view-dashboard",
          rota: "/produtos"
        },
        {
          titulo: "Donos de produto",
          icone: "mdi-account-tie",
          rota: "/donosdeprodutos"
        },
        {
          titulo: "Categorias de produto",
          icone: "mdi-format-list-bulleted-type",
          rota: "/categoriasdeprodutos"
        },
      ]
    };
  }
};
</script>
