<template>
  <v-row align="center" justify="center">
    <v-col cols="12" sm="8" md="4">
      <v-card class="elevation-12">
        <v-toolbar color="primary" dark flat>
          <v-spacer />
          <v-toolbar-title><span class="font-weight-bold">Paty</span><span class="font-weight-light">App</span> Login</v-toolbar-title>
          <v-spacer />
        </v-toolbar>
        <v-card-text>
          <v-form>
            <v-text-field label="Usuário" v-model="usuario.usuario" prepend-icon="mdi-account" type="text" />
            <v-text-field label="Senha" v-model="usuario.senha" prepend-icon="mdi-lock" type="password" @keydown.enter="autenticarUsuario()"/>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" class="mb-5" @click="autenticarUsuario()">Entrar</v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-col>
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" class="text-center" bottom :timeout="snackbar.timeout">
      {{snackbar.message}}
      <i class="fas fa-check"></i>
    </v-snackbar>
  </v-row>
</template>
<script>
import Vue from "vue";
export default {
  name: "Login",
  components: {},
  data() {
    return {
      usuario: {
        usuario: "",
        senha: ""
      },
      snackbar: {
        show: false,
        message: "",
        color: "green",
        timeout: 2500
      }
    };
  },
  methods: {
    autenticarUsuario() {
      Vue.axios
        .post("usuario/login", { ...this.usuario })
        .then(response => {
          // console.log(response.data);
          localStorage.setItem("userUsername", response.data.usuario);
          localStorage.setItem("userName", response.data.nome);
          localStorage.setItem("userID", response.data._id);
          this.$router.push('/home');
          // this.mostrarToast("Sucesso");
          this.usuario.login = "";
          this.usuario.senha = "";
        })
        .catch(() => {
          this.usuario.senha = "";
          this.mostrarToast("Falha", "red");
        });
    },
    mostrarToast(message, color = "green") {
      this.snackbar.show = true;
      this.snackbar.color = color;
      this.snackbar.message = message;
      setTimeout(() => {
        this.snackbar.message = "";
      }, this.snackbar.timeout + 100);
    }
  }
};
</script>
