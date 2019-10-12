<template>
  <div>
    <v-card>
      <v-card-title>
        Pesquisar clientes
        <v-col cols="12" sm="3">
          <v-btn text icon color="purple" @click="atualizarLista()">
            <v-icon>mdi-cached</v-icon>
          </v-btn>
        </v-col>
        <div class="flex-grow-1"></div>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Pesquisar"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table :headers="headers" :items="clientes" :search="search" sort-by="name"></v-data-table>
    </v-card>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Home",
  data() {
    return {
      search: "",
      headers: [
        { text: "Nome", value: "name" },
        { text: "Contato", value: "contact" },
        { text: "Endereço", value: "address" },
        { text: "CPF", value: "cpf" }
      ],
      clientes: []
    };
  },
  methods: {
    atualizarLista() {
      let api_url =
        process.env.VUE_APP_ENV === "dev"
          ? process.env.VUE_APP_API_URL_LOCAL
          : process.env.VUE_APP_API_URL;
      var _this = this;

      axios
        .get(`${api_url}/customers`)
        .then((response) => {
          _this.clientes = response.data;
        });
    }
  },
  created() {
    this.atualizarLista();
  }
};
</script>
