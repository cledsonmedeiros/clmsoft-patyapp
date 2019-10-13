<template>
  <div>
    <v-card>
      <v-card-title>
        Pesquisar dono de produto
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
      <v-data-table :headers="headers" :items="donoproduto" :search="search" sort-by="name"></v-data-table>
    </v-card>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "PesquisarDonoProduto",
  data() {
    return {
      search: "",
      headers: [
        { text: "Nome", value: "name" },
      ],
      donoproduto: []
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
        .get(`${api_url}/productowner`)
        .then((response) => {
          _this.donoproduto = response.data;
        });
    }
  },
  created() {
    this.atualizarLista();
    console.log(process.env.VUE_APP_ENV);

  }
};
</script>
