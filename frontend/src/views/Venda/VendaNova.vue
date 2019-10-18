<template>
  <v-container class="grey lighten-5">
    <v-snackbar v-model="snackbar" :timeout="timeout">
      teste
      <v-btn color="blue" text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
    <v-layout row>
      <v-flex xs12>
        <v-card class="ma-1" :elevation="elevation">
          <v-card-text>
            Categorias
            <v-btn text icon color="purple" @click="limparCesta()">
              <v-icon>mdi-cached</v-icon>
            </v-btn>
            <v-btn text icon color="purple" @click="snackbar = true">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-card-text>
          <v-card-text>
            <v-btn
              rounded
              small
              color="purple"
              class="mx-1 mb-3"
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

          <v-chip pill class="ma-2 purple" dark v-for="item in cesta" :key="item.produto.index">
            <v-avatar left color="purple lighten-3" class="mr-4" @click="decrementarItem(item)">
              <v-icon dark>mdi-minus</v-icon>
            </v-avatar>
            <v-avatar left color="purple lighten-3" class="mr-4" @click="incrementarItem(item)">
              <v-icon dark>mdi-plus</v-icon>
            </v-avatar>
            <!-- <v-avatar left color="purple" @click="removerItem(item)">
              <v-icon dark>mdi-close</v-icon>
            </v-avatar> -->
            {{item.quantidade}} x {{item.produto.name}} - R${{item.total}}
          </v-chip>

          <!-- <v-btn-toggle
            background-color="purple"
            class="ma-2"
            dark
            dense
            multiple
            v-for="item in cesta"
            :key="item.produto.index"
          >
            <v-btn>{{item.quantidade}} x {{item.produto.name}} - R${{item.total}}</v-btn>
            <v-btn @click="incrementarItem(item)">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-btn-toggle>-->
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
      search: "",
      snackbar: false,
      timeout: 2000
    };
  },
  methods: {
    teste() {
      console.log("teste");
    },
    incrementarItem(item) {
      this.cesta[item.index].quantidade += 1;
      this.total = 0;
      this.cesta.forEach(this.somarTotal);
    },
    decrementarItem(item) {
      if(this.cesta[item.index].quantidade >= 1){
        this.cesta[item.index].quantidade -= 1;
        this.total = 0;
        this.cesta.forEach(this.somarTotal);
      }
    },
    // removerItem(item) {
    //   this.cesta.splice(item.index,1);
    //   this.total = 0;
    //   this.cesta.forEach(this.somarTotal);
    // },
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

        axios.get(`${api_url}/products`).then(response => {
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
      this.search = "";
    }
  },
  created() {
    this.getCategorias();
  }
};
</script>

<style>
</style>
