<template>
  <div>
    <v-card>
      <v-card-title>
        Pesquisar produto
        <v-col cols="12" sm="3">
          <v-btn text icon color="purple" @click="atualizarLista()">
            <v-icon>mdi-cached</v-icon>
          </v-btn>
          <v-btn text icon color="purple" to="/produtos/gerenciar">
            <v-icon>mdi-format-list-bulleted</v-icon>
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
      <v-data-table :headers="headers" :items="produtos" :search="search" sort-by="name"></v-data-table>
    </v-card>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ProdutoPesquisar",
  data() {
    return {
      search: "",
      headers: [{ text: "Nome", value: "name" }],
      produtos: []
    };
  },
  methods: {
    atualizarLista() {
      let api_url =
        process.env.VUE_APP_ENV === "dev"
          ? process.env.VUE_APP_API_URL_LOCAL
          : process.env.VUE_APP_API_URL;
      var _this = this;

      axios.get(`${api_url}/products`).then(response => {
        _this.produtos = response.data;
      });
    }
  },
  created() {
    this.atualizarLista();
  }
};
</script>
