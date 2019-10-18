<template>
  <v-container class="grey lighten-5">
    <v-snackbar v-model="snackbar" color="green" top :timeout="timeout">
      Exemplo toast
      <!-- <v-btn dark text @click="snackbar = false">Fechar</v-btn> -->
    </v-snackbar>

    <v-layout row>
      <v-flex sm12>
        <v-card class="ma-1" :elevation="elevation">
          <v-card-text>
            <div>
              Cliente
              <v-text-field
                color="purple"
                v-model="searchCliente"
                @input="getClientesPesquisa()"
                append-icon="mdi-magnify"
                label="Pesquisar"
                single-line
                hint="Pesquisar cliente"
                persistent-hint
              ></v-text-field>
            </div>
            <div v-if="this.clienteSelected.name !== ''" class="mt-3">
              Cliente selecionado:
              <b>{{clienteSelected.name}}</b>
              <v-btn text icon color="purple" @click="unsetCliente()">
                <v-icon small>mdi-close</v-icon>
              </v-btn>
            </div>
            <div>
              <v-btn
                rounded
                small
                color="purple"
                class="mt-3 mr-2"
                dark
                v-for="cliente in clientes"
                v-bind:key="cliente._id"
                @click="setCliente(cliente)"
              >{{cliente.name}}</v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <v-layout row>
      <v-flex xs12>
        <v-card class="ma-1" :elevation="elevation">
          <v-card-text>
            <div>Categorias</div>
            <div>
              <v-btn
                rounded
                small
                color="purple"
                class="mt-3 mr-2"
                dark
                v-for="categoria in categorias"
                v-bind:key="categoria._id"
                @click="getProdutos(categoria._id)"
              >{{categoria.name}}</v-btn>
            </div>
            <!-- <v-btn text icon color="purple" @click="snackbar = true">
                <v-icon>mdi-plus</v-icon>
            </v-btn>-->
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
                color="purple"
                v-model="searchProduto"
                @input="getProdutosPesquisa()"
                append-icon="mdi-magnify"
                label="Pesquisar"
                single-line
                hint="Pesquisar produto"
                persistent-hint
              ></v-text-field>
            </div>
            <div>
              <v-btn
                rounded
                small
                color="purple"
                class="mt-4 mr-2"
                dark
                v-for="produto in produtos"
                v-bind:key="produto._id"
                @click="addProdutoCesta(produto)"
              >{{produto.name}} - R${{produto.price_sell.toFixed(2)}}</v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <v-layout row>
      <v-flex xs12>
        <v-card class="ma-1" :elevation="elevation">
          <v-card-text class="ma-0">
            <div>
              Cesta
              <v-btn text icon color="purple" @click="limparCesta()">
                <v-icon>mdi-cached</v-icon>
              </v-btn>
            </div>
            <div>
              Total:
              <b>{{this.total.toFixed(2)}}</b>
            </div>
            <div>
              <v-chip
                pill
                class="my-2 mr-2 purple"
                dark
                v-for="item in cesta"
                :key="item.produto.index"
              >
                <v-avatar left color="purple lighten-3" class="mr-4" @click="decrementarItem(item)">
                  <v-icon dark>mdi-minus</v-icon>
                </v-avatar>
                <v-avatar left color="purple lighten-3" @click="incrementarItem(item)">
                  <v-icon dark>mdi-plus</v-icon>
                </v-avatar>
                <!-- <v-avatar left color="purple" @click="removerItem(item)">
              <v-icon dark>mdi-close</v-icon>
                </v-avatar>-->
                {{item.quantidade}} x {{item.produto.name}} - R${{item.total}}
              </v-chip>
            </div>
          </v-card-text>
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
      clientes: [],
      cesta: [],
      total: 0,
      searchProduto: "",
      searchCliente: "",
      snackbar: false,
      timeout: 2000,
      clienteSelected: {
        _id: "",
        name: ""
      }
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
      if (this.cesta[item.index].quantidade >= 1) {
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
    getClientesPesquisa() {
      let api_url =
        process.env.VUE_APP_ENV === "dev"
          ? process.env.VUE_APP_API_URL_LOCAL
          : process.env.VUE_APP_API_URL;

      if (this.searchCliente !== "") {
        axios
          .get(`${api_url}/customers/name/${this.searchCliente}`)
          .then(response => {
            this.clientes = response.data;
          });
      } else {
        this.clientes = [];
      }
    },
    getProdutosPesquisa() {
      let api_url =
        process.env.VUE_APP_ENV === "dev"
          ? process.env.VUE_APP_API_URL_LOCAL
          : process.env.VUE_APP_API_URL;

      if (this.searchProduto !== "") {
        axios
          .get(`${api_url}/products/name/${this.searchProduto}`)
          .then(response => {
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
      } else if (id_categoria === "todos") {
        let api_url =
          process.env.VUE_APP_ENV === "dev"
            ? process.env.VUE_APP_API_URL_LOCAL
            : process.env.VUE_APP_API_URL;

        axios.get(`${api_url}/products`).then(response => {
          this.produtos = response.data;
        });
      }
      this.searchProduto = "";
    },
    somarTotal(element, index, array) {
      this.total += Number(element.quantidade) * Number(element.total);
    },
    addProdutoCesta(produto) {
      let item = {
        index: this.cesta.length,
        quantidade: 1,
        produto: produto,
        total: 1 * produto.price_sell
      };
      this.cesta.push(item);
      this.total = this.total + produto.price_sell;
      this.produtos = [];
      this.searchProduto = "";
    },
    setCliente(cliente) {
      this.clienteSelected._id = cliente._id;
      this.clienteSelected.name = cliente.name;
      this.clientes = [];
      this.searchCliente = "";
    },
    unsetCliente() {
      this.clienteSelected._id = "";
      this.clienteSelected.name = "";
      this.clientes = [];
      this.searchCliente = "";
    }
  },
  created() {
    this.getCategorias();
  }
};
</script>
