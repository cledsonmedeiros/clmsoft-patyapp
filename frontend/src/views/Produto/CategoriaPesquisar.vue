<template>
  <div>
    <v-card>
      <v-card-title>
        Pesquisar categorias de produto
        <v-col cols="12" sm="3">
          <v-btn text icon color="purple" @click="atualizarLista()">
            <v-icon>mdi-cached</v-icon>
          </v-btn>
          <v-btn text icon color="purple" to="/categoriasdeprodutos/gerenciar">
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
      <v-data-table :headers="headers" :items="categoriaproduto" :search="search" sort-by="name"></v-data-table>
    </v-card>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ProdutoCategoriaPesquisar",
  data() {
    return {
      search: "",
      headers: [
        { text: "Nome", value: "name" },
      ],
      categoriaproduto: []
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
        .get(`${api_url}/productcategory`)
        .then((response) => {
          _this.categoriaproduto = response.data;
        });
    }
  },
  created() {
    this.atualizarLista();
  }
};
</script>
