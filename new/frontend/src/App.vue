<template>
  <v-app>
    <Navbar v-if="show"></Navbar>
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
    return {
      show: false
    };
  },
  methods: {
    getRoute(){
      this.show = this.$route.name !== 'login'
      // console.log( ['login', 'register'].indexOf(this.$route.name) !== -1)
      console.log(this.$route.name !== 'login');
      
    }
  },
  created() {
    this.getRoute()
  }
};
</script>
