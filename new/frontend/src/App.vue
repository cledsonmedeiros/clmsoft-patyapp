<template>
  <v-app>
    <v-content>
      <v-container fluid :class="this.$route.name === 'login' ? 'fill-height' : ''">
        <router-view></router-view>
      </v-container>
    </v-content>
  </v-app>
  
</template>

<script>
export default {
  name: "App",

  components: {},

  data: () => ({})
};
</script>
