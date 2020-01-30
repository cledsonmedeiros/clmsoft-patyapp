<template>
  <v-app class="grey lighten-4">
    <NavBar v-show="['login', 'register'].indexOf($route.name) === -1"></NavBar>
    <v-content class="ma-4" id="appContent">
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import NavBar from "./components/NavBar";

export default {
  name: "App",
  components: {
    NavBar
  },
};
</script>
