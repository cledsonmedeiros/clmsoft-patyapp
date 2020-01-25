<template>
  <v-app>
    <NavigationBar v-if="this.$route.name !== 'login'"></NavigationBar>
    <v-content>
      <v-container fluid :class="this.$route.name === 'login' ? 'fill-height' : ''">
        <router-view></router-view>
      </v-container>
    </v-content>
  </v-app>

</template>

<script>
import NavigationBar from "@/components/layout/NavigationBar";

export default {
  name: "App",
  components: { NavigationBar },
  data() {
    return {};
  },
  methods: {},
  created() {}
};
</script>
