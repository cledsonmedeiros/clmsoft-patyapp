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
        <span>Menu</span>
      </v-list-item>

      <v-divider></v-divider>

      <v-list>
        <v-list-item to="/">
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>

          <v-list-item-title>Home</v-list-item-title>
        </v-list-item>

        <v-list-group prepend-icon="mdi-account-circle" value="true">
          <template v-slot:activator>
            <v-list-item-title>Clientes</v-list-item-title>
          </template>

          <v-list-item-group link>
            <v-list-item to="/clientes/pesquisar">
              <v-list-item-icon>
                <v-icon>mdi-magnify</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Pesquisar</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item to="/clientes/crud">
              <v-list-item-icon>
                <v-icon>mdi-format-list-bulleted</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Gerenciar</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>

        </v-list-group>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  data: () => ({
    drawer: null,
  })
};
</script>


<style lang="stylus"></style>
