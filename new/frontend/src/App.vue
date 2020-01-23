<template>
  <v-app>
    <Navbar v-if="this.$route.name !== 'login'"></Navbar>
    <v-content>
      <v-container fluid :class="this.$route.name === 'login' ? 'fill-height' : ''">
        <router-view></router-view>
      </v-container>
    </v-content>
  </v-app>

</template>

<script>
import Navbar from "@/components/layout/Navbar";

export default {
  name: "App",
  components: { Navbar },
  data() {
    return {};
  },
  methods: {},
  created() {}
};
</script>
