<template>
  <div>
    <v-navigation-drawer v-model="menu" absolute temporary>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">
            Menu
          </v-list-item-title>
          <v-list-item-subtitle>
            {{usuario.nome}}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list nav dense>
        <v-list-item-group active-class="primary--text">

          <v-list-item :to="item.rota" v-for="item in itensMenu" :key="item.rota">
            <v-list-item-title>
              <v-icon small class="mr-2">{{item.icone}}</v-icon>
              <span>{{item.titulo}}</span>
            </v-list-item-title>
          </v-list-item>

        </v-list-item-group>
      </v-list>

      <v-divider v-if="usuario.username === 'admin'"></v-divider>

      <v-list nav dense v-if="usuario.username === 'admin'">
        <v-list-item-group active-class="primary--text">

          <v-list-item to="/usuarios">
            <v-list-item-title>
              <v-icon small class="mr-2">mdi-account-multiple</v-icon>
              <span>Usuários</span>
            </v-list-item-title>
          </v-list-item>

        </v-list-item-group>
      </v-list>

    </v-navigation-drawer>
    <v-app-bar app dense color="primary" dark>
      <v-app-bar-nav-icon @click.stop="menu = !menu"></v-app-bar-nav-icon>
      <v-toolbar-title disabled><span class="font-weight-bold">Paty</span><span class="font-weight-light">App</span></v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn text @click="realizarLogout()">
        <v-icon>mdi-reply</v-icon>
        <span class="ml-2">Sair</span>
      </v-btn>
    </v-app-bar>
  </div>
</template>
<script>
export default {
  name: "Navbar",
  data() {
    return {
      menu: false,
      usuario: {
        nome: localStorage.userName,
        username: localStorage.userUsername,
        id: localStorage.userID
      },
      itensMenu: [
        { rota: "/home", icone: "mdi-home", titulo: "Home" },
        { rota: "/clientes", icone: "mdi-account-group", titulo: "Clientes" },
        {
          rota: "/categorias",
          icone: "mdi-format-list-bulleted-type",
          titulo: "Categorias"
        },
        { rota: "/produtos", icone: "mdi-view-dashboard", titulo: "Produtos" },
        { rota: "/vendas", icone: "mdi-currency-brl", titulo: "Vendas" },
        // { rota: "/relatorios", icone: "mdi-file-chart", titulo: "Relatórios" }
      ]
    };
  },
  methods: {
    realizarLogout() {
      localStorage.clear();
      this.$router.push("/");
    }
  }
};
</script>
