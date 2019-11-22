<template>
  <v-app>
    <Menu></Menu>
    <v-content>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import Menu from "./components/layout/Menu";

export default {
  name: "App",

  components: {
    Menu
  },

  data: () => ({
  })
};
</script>
