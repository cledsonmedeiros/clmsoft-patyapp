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
            <v-text-field label="Senha" v-model="usuario.senha" prepend-icon="mdi-lock" type="password" @keydown.enter="autenticarUsuario()" />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" class="mb-5" @click="autenticarUsuario()">Entrar</v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-col>
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
      }
    };
  },
  methods: {
    autenticarUsuario() {
      Vue.axios
        .post("usuario/login", { ...this.usuario })
        .then(response => {
          localStorage.setItem("userUsername", response.data.usuario);
          localStorage.setItem("userName", response.data.nome);
          localStorage.setItem("userID", response.data._id);
          this.$router.push("/home");
          this.usuario.login = "";
          this.usuario.senha = "";
        })
        .catch(() => {
          this.usuario.senha = "";
          this.mostrarToast("Credenciais incorretas", "error");
        });
    },
    mostrarToast(msg, tipo = "success") {
      this.$toast.open({
        message: msg,
        type: tipo,
        position: "bottom",
        duration: 3000,
        dismissible: true
      });
    }
  }
};
</script>
