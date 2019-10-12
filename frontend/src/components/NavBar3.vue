<template>
  <div>
    <v-toolbar flat color="purple darken-1">
      <v-app-bar-nav-icon dark @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="text-uppercase white--text">
        <span class="font-weight-light">Paty</span>
        <span>App</span>
      </v-toolbar-title>
      <div class="flex-grow-1"></div>
      <v-btn text color="white">
        <v-icon left>mdi-reply</v-icon>
        <span>Sair</span>
      </v-btn>
    </v-toolbar>

    <v-navigation-drawer v-model="drawer" absolute temporary>
      <v-list-item>
        <span class="font-weight-light">Paty</span>
        <span>App</span>
        <div class="flex-grow-1"></div>
        <span>
          <v-btn text color="purple" to="/">
            <v-icon left>mdi-home</v-icon>
            <span>Home</span>
          </v-btn>
        </span>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense rounded>
        <v-list-group
          v-for="item in items"
          :key="item.title"
          v-model="item.active"
          :prepend-icon="item.action"
          no-action
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item v-for="subItem in item.items" :key="subItem.title">
            <v-list-item :to="subItem.route">
                <v-list-item-icon>
                  <v-icon>{{subItem.icon}}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{subItem.title}}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            <!-- <v-list-item-content> -->

              <!-- <v-list-item-title v-text="subItem.title" to="/" ></v-list-item-title> -->
            <!-- </v-list-item-content> -->
          </v-list-item>
        </v-list-group>
      </v-list>

      <!-- <v-list dense rounded="">

        <v-list-item-group v-for="item in items" :key="item.title" link>
          <v-list-item :to="item.route">
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>

      </v-list>-->
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      drawer: null,
      items: [
        {
          action: "mdi-account-circle",
          title: "Clientes",
          items: [
            {
              title: "Pesquisar",
              icon: "mdi-magnify",
              route: "/clientes/pesquisar"
            },
            {
              title: "Gerenciar",
              icon: "mdi-format-list-bulleted",
              route: "/clientes/gerenciar"
            },
          ]
        },
        {
          action: "mdi-microsoft",
          title: "Produtos",
          items: [
            {
              title: "Pesquisar",
              icon: "mdi-magnify",
              route: "/produtos/pesquisar"
            },
            {
              title: "Gerenciar",
              icon: "mdi-format-list-bulleted",
              route: "/produtos/gerenciar"
            },
          ]
        },
      ]
    };
  }
};
</script>
