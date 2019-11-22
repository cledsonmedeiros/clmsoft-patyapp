<template>
  <div>
    <v-navigation-drawer v-model="drawer" absolute temporary>
      <v-divider></v-divider>
      <v-list dense>
        <v-list-item v-for="item in rotas" :key="item.path" :to="item.path" link>
          <v-list-item-icon>
            <v-icon>{{ item.meta.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.meta.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app color="primary" dense dark>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <div class="d-flex align-center">
        <v-img alt="Vuetify Logo" class="shrink mr-2" contain src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png" transition="scale-transition" width="40" />
      </div>
      <v-spacer></v-spacer>
      <v-btn text>
        <v-icon>mdi-reply</v-icon>
        <span class="ml-2">Sair</span>
      </v-btn>
    </v-app-bar>
  </div>
</template>
<script>
export default {
  name: "Menu",
  components: {},
  data() {
    return {
      drawer: false,
    };
  },
  methods: {},
  computed: {
    rotas(){
      return this.$router.options.routes
    }
  },
};
</script>
