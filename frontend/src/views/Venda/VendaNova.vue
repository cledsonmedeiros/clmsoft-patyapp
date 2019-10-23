<template>
  <div class="mx-2">
    <v-snackbar v-model="snackbar" color="green" class="text-center" bottom :timeout="timeout">
      Compra salva com sucesso
      <i class="fas fa-check"></i>
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
              >{{produto.name}} - R$ {{produto.price_sell.toFixed(2)}}</v-btn>
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
              <v-btn
                text
                icon
                color="purple"
                :disabled="this.cesta.length === 0 || this.clienteSelected._id.length === 0"
                @click="limparCesta()"
              >
                <v-icon>mdi-cached</v-icon>
              </v-btn>
              <v-btn
                text
                icon
                color="purple"
                :disabled="this.cesta.length === 0 || this.clienteSelected._id.length === 0"
                @click="salvarCesta()"
              >
                <v-icon>mdi-content-save</v-icon>
              </v-btn>
            </div>
            <div>
              Total:
              <b>R$ {{this.total.toFixed(2)}}</b>
            </div>
            <div>
              <v-chip
                small
                pill
                class="my-2 mr-2 purple"
                dark
                v-for="item in cesta"
                :key="item.produto.index"
                @click="abrirEdicao(item)"
              >
                {{item.quantidade}}
                <v-divider vertical class="mx-2"></v-divider>
                {{item.produto.name}}
                <v-divider vertical class="mx-2"></v-divider>
                R$ {{item.produto.price_sell.toFixed(2)}}
              </v-chip>
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">{{editedItem.nome}}</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  color="purple"
                  @input="bindDisabled()"
                  type="number"
                  v-model="editedItem.quantidade"
                  label="Quantidade"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-text-field color="purple" v-model="editedItem.valor" label="Valor"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="purple" text @click="fecharEdicao()">Cancelar</v-btn>
          <v-btn color="purple" text @click="deletarItemCesta()">Deletar</v-btn>
          <v-btn color="purple" text @click="salvarEdicao()" :disabled="this.estadoBotao">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from "axios";
import { log } from "util";
import { async } from "q";

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
      },
      dialog: false,
      editedItem: {
        index: -1,
        nome: "",
        quantidade: 0,
        preco: 0
      },
      api_url:
        process.env.VUE_APP_ENV === "dev"
          ? process.env.VUE_APP_API_URL_LOCAL
          : process.env.VUE_APP_API_URL,
      estadoBotao: false
    };
  },
  methods: {
    bindDisabled() {
      if(this.editedItem.quantidade > this.produtos[this.editedItem.index].amount || this.editedItem.quantidade <= 0){
        this.estadoBotao = true;
      } else {
        this.estadoBotao = false;
      }
    },
    salvarCesta() {
      let itensVenda = [];
      this.cesta.forEach(element => {
        itensVenda.push({
          produto: element.produto._id,
          quantidade: element.quantidade,
          preco: element.produto.price_sell,
          total: element.total
        });
      });

      let venda = {
        data: {
          data_completa: new Date().toLocaleDateString(),
          data_dia: new Date().toLocaleDateString().split("/")[0],
          data_mes: new Date().toLocaleDateString().split("/")[1],
          data_ano: new Date().toLocaleDateString().split("/")[2]
        },
        cliente: this.clienteSelected._id,
        // isParcelado: false,
        total: this.total,
        total_pago: 0
      };

      var itensID = [];

      for (let index = 0; index < itensVenda.length; index++) {
        const element = itensVenda[index];
        axios
          .post(`${this.api_url}/sellitem`, {
            sellItem: {
              product: element.produto,
              price: element.preco,
              amount: element.quantidade,
              total: element.total
            }
          })
          .then(response => {
            itensID[index] = String(response.data.id);
          })
          .catch(response => {
            console.log("falha", response);
          });
      }

      this.snackbar = true;

      setTimeout(function(snack) {
        if (itensID.length !== 0) {
          let api_url =
            process.env.VUE_APP_ENV === "dev"
              ? process.env.VUE_APP_API_URL_LOCAL
              : process.env.VUE_APP_API_URL;

          axios
            .post(`${api_url}/sell`, {
              sell: {
                date_complete: venda.data.data_completa,
                date_day: venda.data.data_dia,
                date_month: venda.data.data_mes,
                date_year: venda.data.data_ano,
                customer: venda.cliente,
                total: venda.total,
                total_paid: venda.total_pago,
                products: itensID
              }
            })
            .then(response => {
            })
            .catch(response => {
              console.log("falha", response);
            });
        }
      }, 500);

      this.limparCestaAposSalvarCompra();
    },
    deletarItemCesta() {
      this.cesta.splice(this.editedItem.index, 1);
      this.produtos = [];
      this.atualizarCesta();
      this.fecharEdicao();
    },
    abrirEdicao(item) {
      this.editedItem.index = item.index;
      this.editedItem.nome = item.produto.name;
      this.editedItem.quantidade = item.quantidade;
      this.editedItem.valor = item.produto.price_sell;
      this.dialog = true;
    },
    fecharEdicao() {
      this.dialog = false;
      this.editedItem.nome = "";
      this.editedItem.quantidade = 0;
      this.editedItem.valor = 0;
    },
    salvarEdicao() {
      this.cesta[this.editedItem.index].quantidade = Number(
        this.editedItem.quantidade
      );
      this.cesta[this.editedItem.index].produto.price_sell = Number(
        this.editedItem.valor
      );
      this.cesta[this.editedItem.index].total =
        Number(this.editedItem.valor) * Number(this.editedItem.quantidade);
      this.atualizarCesta();
      this.fecharEdicao();
    },
    atualizarCesta() {
      this.total = 0;
      this.cesta.forEach(this.atualizarTotalCesta);
    },
    limparCesta() {
      if (confirm("Deseja realmente limpar a cesta?")) {
        this.cesta = [];
        this.total = 0;
        this.produtos = [];
        this.unsetCliente();
        this.searchCliente = "";
        this.searchProduto = "";
      }
    },
    limparCestaAposSalvarCompra() {
      this.cesta = [];
      this.total = 0;
      this.produtos = [];
      this.unsetCliente();
      this.searchCliente = "";
      this.searchProduto = "";
    },
    getCategorias() {
      axios.get(`${this.api_url}/productcategory`).then(response => {
        this.categorias = response.data;
        this.categorias.push({ _id: "todos", name: "Todos" });
        this.categorias.push({ _id: "nenhum", name: "Nenhum" });
      });
    },
    getClientesPesquisa() {
      if (this.searchCliente !== "") {
        axios
          .get(`${this.api_url}/customers/name/${this.searchCliente}`)
          .then(response => {
            this.clientes = response.data;
          });
      } else {
        this.clientes = [];
      }
    },
    getProdutosPesquisa() {
      if (this.searchProduto !== "") {
        axios
          .get(`${this.api_url}/products/name/${this.searchProduto}`)
          .then(response => {
            this.produtos = response.data;
          });
      } else {
        this.produtos = [];
      }
    },
    getProdutos(id_categoria) {
      if (id_categoria !== "nenhum" && id_categoria !== "todos") {
        axios
          .get(`${this.api_url}/products/category/${id_categoria}`)
          .then(response => {
            this.produtos = response.data;
          });
      } else if (id_categoria === "nenhum") {
        this.produtos = [];
      } else if (id_categoria === "todos") {
        axios.get(`${this.api_url}/products`).then(response => {
          this.produtos = response.data;
        });
      }
      this.searchProduto = "";
    },
    atualizarTotalCesta(element, index, array) {
      this.cesta[index].index = index;
      this.total += Number(element.total);
    },
    addProdutoCesta(produto) {
      let item = {
        index: this.cesta.length,
        quantidade: 1,
        produto: produto,
        total: produto.price_sell
      };
      this.cesta.push(item);
      this.total = this.total + produto.price_sell;
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
