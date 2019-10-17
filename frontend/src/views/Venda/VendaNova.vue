<template>
  <v-container class="grey lighten-5">
    <v-layout row>
      <v-flex xs12>
        <v-card class="ma-1" :elevation="elevation">
          <v-card-text>
            categorias
            <v-btn text icon class="mr-10" color="purple" @click="limparCesta()">
              <v-icon>mdi-cached</v-icon>
            </v-btn>
          </v-card-text>
          <v-card-text>
            <v-btn
              rounded
              small
              color="purple"
              class="mx-1"
              dark
              v-for="categoria in categorias"
              v-bind:key="categoria._id"
              @click="getProdutos(categoria._id)"
            >{{categoria.name}}</v-btn>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <v-layout row>
      <v-flex sm12>
        <v-card class="ma-1" :elevation="elevation">
          <v-card-text>
            <div>
              Produtos
              <v-text-field
                v-model="search"
                @input="getProdutosPesquisa()"
                append-icon="mdi-magnify"
                label="Pesquisar"
                single-line
                hint="Pesquisar produto"
                persistent-hint
              ></v-text-field>
            </div>
          </v-card-text>

          <v-btn
            rounded
            small
            color="purple"
            class="my-4 ml-2"
            dark
            v-for="produto in produtos"
            v-bind:key="produto._id"
            @click="addCesta(produto)"
          >{{produto.name}} - R${{produto.price_sell.toFixed(2)}}</v-btn>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12>
        <v-card class="ma-1" :elevation="elevation">
          <v-card-text>Cesta</v-card-text>
          <v-card-title>Total: {{this.total.toFixed(2)}}</v-card-title>
          <v-btn-toggle
            background-color="purple"
            class="ma-2"
            dark
            dense
            multiple
            v-for="item in cesta"
            :key="item.produto.index"
          >
            <v-btn>{{item.quantidade}} x {{item.produto.name}} - R${{item.total}}</v-btn>
            <v-btn @click="teste(item)">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-btn-toggle>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  name: "VendaNova",
  data() {
    return {
      elevation: 2,
      categorias: [],
      produtos: [],
      cesta: [],
      total: 0,
      search: ""
    };
  },
  methods: {
    teste(item) {
      this.cesta[item.index].quantidade += 1;
      this.total = 0;
      this.cesta.forEach(this.somarTotal);
    },
    limparCesta() {
      this.cesta = [];
      this.total = 0;
      this.search = "";
    },
    getCategorias() {
      let api_url =
        process.env.VUE_APP_ENV === "dev"
          ? process.env.VUE_APP_API_URL_LOCAL
          : process.env.VUE_APP_API_URL;

      axios.get(`${api_url}/productcategory`).then(response => {
        this.categorias = response.data;
        this.categorias.push({ _id: "todos", name: "Todos" });
        this.categorias.push({ _id: "nenhum", name: "Nenhum" });
      });
    },
    getProdutosPesquisa() {
      let api_url =
        process.env.VUE_APP_ENV === "dev"
          ? process.env.VUE_APP_API_URL_LOCAL
          : process.env.VUE_APP_API_URL;

      if (this.search !== "") {
        axios.get(`${api_url}/products/name/${this.search}`).then(response => {
          this.produtos = response.data;
        });
      } else {
        this.produtos = [];
      }
    },
    getProdutos(id_categoria) {
      if (id_categoria !== "nenhum" && id_categoria !== "todos") {
        let api_url =
          process.env.VUE_APP_ENV === "dev"
            ? process.env.VUE_APP_API_URL_LOCAL
            : process.env.VUE_APP_API_URL;

        axios
          .get(`${api_url}/products/category/${id_categoria}`)
          .then(response => {
            this.produtos = response.data;
          });
      } else if (id_categoria === "nenhum") {
        this.produtos = [];
        this.search = "";
      } else if (id_categoria === "todos") {
        let api_url =
          process.env.VUE_APP_ENV === "dev"
            ? process.env.VUE_APP_API_URL_LOCAL
            : process.env.VUE_APP_API_URL;

        axios
          .get(`${api_url}/products`)
          .then(response => {
            this.produtos = response.data;
            this.search = "";
          });
      }
    },
    somarTotal(element, index, array) {
      this.total += Number(element.quantidade) * Number(element.total);
    },
    addCesta(produto) {
      let item = {
        index: this.cesta.length,
        quantidade: 1,
        produto: produto,
        total: 1 * produto.price_sell
      };
      this.cesta.push(item);
      this.total = this.total + produto.price_sell;
      this.produtos = [];
    }
  },
  created() {
    this.getCategorias();
  }
};
</script>

<style>
</style>
