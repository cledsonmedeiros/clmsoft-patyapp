<template>
  <v-app class="grey lighten-4">
    <NavBar></NavBar>
    <v-content class="mx-4 mb-4 mt-2">
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import NavBar from '@/components/NavBar2';

export default {
  name: 'App',
  components: {
    NavBar,
  },
  data: () => ({
    //
  }),
};
</script>
