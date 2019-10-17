<template>
  <v-container class="grey lighten-5">
    <v-layout row>
      <v-flex xs12>
        <v-card class="ma-1" :elevation="elevation">
          <v-card-text>Categorias</v-card-text>
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
          <v-card-text>Produtos</v-card-text>
          <v-btn
            rounded
            small
            color="purple"
            class="my-4 ml-2"
            dark
            v-for="produto in produtos"
            v-bind:key="produto._id"
            @click="addCesta(produto)"
          >{{produto.name}}</v-btn>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12>
        <v-card class="ma-1" :elevation="elevation">
          <v-card-text>Cesta</v-card-text>
          <!-- <v-card-title>Total: {{this.total.toFixed(2)}}</v-card-title> -->
          <v-btn-toggle
            background-color="purple"
            class="ma-2"
            dark
            dense
            mandatory
            v-for="item in cesta"
            :key="item.produto.index"
          >
            <v-btn>{{item.quantidade}} x {{item.produto.name}} - R${{item.total}}</v-btn>
            <v-btn>
              <v-icon @click="teste(item)">mdi-plus</v-icon>
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
      total: 0
    };
  },
  methods: {
    teste(item) {
      this.cesta[item.index].quantidade += 1
      // console.log(this.cesta[item.index].total);
      // console.log(this.cesta[item.index].quantidade);
      // console.log(this.cesta[item.index].produto.price_sell);
      // console.log(this.cesta[item.index]);

      this.cesta[item.index].total = this.cesta[item.index].quantidade * this.cesta[item.index].produto.price_sell
      console.log();
    },
    getCategorias() {
      let api_url =
        process.env.VUE_APP_ENV === "dev"
          ? process.env.VUE_APP_API_URL_LOCAL
          : process.env.VUE_APP_API_URL;

      axios.get(`${api_url}/productcategory`).then(response => {
        this.categorias = response.data;
      });
    },
    getProdutos(id_categoria) {
      // this.produtos = [];
      let api_url =
        process.env.VUE_APP_ENV === "dev"
          ? process.env.VUE_APP_API_URL_LOCAL
          : process.env.VUE_APP_API_URL;

      axios
        .get(`${api_url}/products/category/${id_categoria}`)
        .then(response => {
          this.produtos = response.data;
          // console.log(this.produtos);
        });
    },
    addCesta(produto) {
      let item = {
        index: this.cesta.length,
        quantidade: 1,
        produto: produto,
        total: 1 * produto.price_sell
      };
      // produto.index = this.cesta.length
      // this.cesta.push(produto);
      this.cesta.push(item);
      this.total = this.total + produto.price_sell;
      // console.log(this.cesta);
    }
  },
  created() {
    this.getCategorias();
  }
};
</script>

<style>
</style>
