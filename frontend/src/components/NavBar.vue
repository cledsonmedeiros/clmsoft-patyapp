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

      </v-list>
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
          title: "Home",
          icon: "mdi-view-dashboard",
          route: "/"
        },
        {
          title: "Meus projetos",
          icon: "mdi-folder-open",
          route: "/projetos"
        },
        {
          title: "Staff",
          icon: "mdi-account-group",
          route: "/staff"
        }
      ]
    };
  }
};
</script>

<style lang="stylus"></style>
