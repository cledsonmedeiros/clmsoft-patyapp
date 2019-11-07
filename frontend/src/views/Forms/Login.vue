<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar color="purple" dark flat>
            <v-toolbar-title>Entrar</v-toolbar-title>
            <!-- <v-spacer /> -->
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field label="Usuário" name="username" prepend-icon="mdi-account" type="text" color="purple" />

              <v-text-field label="Senha" name="password" prepend-icon="mdi-lock" type="password" color="purple" />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="purple" dark @click="goToHome()">
              <v-icon left dark>mdi-send</v-icon>
              Login
            </v-btn>
            <v-spacer />
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  methods:{
    goToHome: function(){
      this.$router.push('/');
    }
  }
};
</script>
