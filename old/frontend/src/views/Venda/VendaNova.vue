<template>
  <div>
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-snackbar v-model="snackbar" :color="snackbarColor" class="text-center" bottom :timeout="snackbarTimeout">
      {{snackbarMessage}}
      <i class="fas fa-check"></i>
    </v-snackbar>
    <v-container fluid class="grey lighten-5" style="padding: 0" v-show="!this.overlay">
      <v-row>
        <v-col cols="12" xs="12" md="6" style="padding-top: 0;">
          <v-card :min-height="heightSup" :elevation="elevation">
            <v-card-text>
              <div>
                Cliente
                <v-text-field color="purple" autocomplete="off" v-model="searchCliente" @input="getClientesPesquisa()" append-icon="mdi-magnify" label="Pesquisar" single-line hint="Pesquisar cliente" persistent-hint></v-text-field>
              </div>
              <div v-if="this.clienteSelected.name !== ''" class="mt-3">
                Cliente selecionado:
                <b>{{clienteSelected.name}}</b>
                <v-btn text icon color="purple" @click="unsetCliente()">
                  <v-icon small>mdi-close</v-icon>
                </v-btn>
              </div>
              <div>
                <v-btn rounded small color="purple" class="mt-3 mr-2" dark v-for="cliente in clientes" v-bind:key="cliente._id" @click="setCliente(cliente)">{{cliente.name}}</v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" xs="12" md="6" style="padding-top: 0;">
          <v-card :min-height="heightSup" :elevation="elevation">
            <v-card-text>
              <div>Categorias de produto</div>
              <div>
                <v-btn rounded small color="purple" class="mt-3 mr-2" dark v-for="categoria in categorias" v-bind:key="categoria._id" @click="getProdutos(categoria._id)">{{categoria.name}}</v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" xs="12" md="6" style="padding-top: 0;">
          <v-card :min-height="heightInf" :elevation="elevation">
            <v-card-text>
              <div>
                Produtos
                <v-text-field color="purple" v-model="searchProduto" @input="getProdutosPesquisa()" append-icon="mdi-magnify" label="Pesquisar" single-line hint="Pesquisar produto" persistent-hint></v-text-field>
              </div>
              <div>
                <v-btn rounded small color="purple" class="mt-4 mr-2" dark v-for="produto in produtos" v-bind:key="produto._id" @click="addProdutoCesta(produto)">{{produto.name}} - R$ {{produto.price_sell.toFixed(2)}}</v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" xs="12" md="6" style="padding-top: 0;">
          <v-card :min-height="heightInf" :elevation="elevation">
            <v-card-text class="ma-0">
              <div>Cesta</div>
              <div>
                Total:
                <b>R$ {{this.total.toFixed(2)}}</b>
                <br />
              </div>
              <div class="mt-3">
                <p>Pagamento:</p>
                <v-switch v-model="isPrazo" dense color="purple" :label="`${isPrazo ? 'à prazo' : 'à vista'}`"></v-switch>
              </div>
              <div v-if="isPrazo" class="mb-3 mx-3">
                <v-layout row>
                  <v-flex xs12 md3 class="mr-3">
                    <v-text-field color="purple" type="number" v-model="qntParcelas" label="Parcelas"></v-text-field>
                  </v-flex>
                  <v-flex xs12 md4 class="mr-3">
                    <v-select :items="periodos" v-model="periodo" label="Período"></v-select>
                  </v-flex>
                  <v-flex xs12 md4>
                    <v-dialog ref="dialog" v-model="modalDataParcela" :return-value.sync="data_atual" persistent width="290px">
                      <template v-slot:activator="{ on }">
                        <v-text-field v-model="data_modificada_formatada" label="Primeira parcela" readonly v-on="on"></v-text-field>
                      </template>
                      <v-date-picker v-model="data_atual" :first-day-of-week="1" locale="pt-br" scrollable>
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="modalDataParcela = false">Fechar</v-btn>
                        <v-btn text color="primary" @click="salvarDataParcela(data_atual)">Salvar</v-btn>
                      </v-date-picker>
                    </v-dialog>
                  </v-flex>
                </v-layout>
              </div>
              <div>
                <v-chip small pill class="my-2 mr-2 purple" dark v-for="item in cesta" :key="item.produto.index" @click="abrirEdicao(item)">
                  {{item.quantidade}}
                  <v-divider vertical class="mx-2"></v-divider>
                  {{item.produto.name}}
                  <v-divider vertical class="mx-2"></v-divider>
                  R$ {{item.produto.price_sell.toFixed(2)}}
                </v-chip>
              </div>
              <div class="mt-3">
                <v-btn text color="purple" @click="limparCesta()" :disabled="this.cesta.length === 0">
                  Limpar
                </v-btn>
                <v-btn text color="purple" @click="salvarCesta()" :disabled="this.cesta.length === 0 || this.clienteSelected._id.length === 0">
                  Salvar
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">{{editedItem.nome}}</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="6">
                <v-text-field color="purple" min="0" @input="bindDisabled()" type="number" v-model="editedItem.quantidade" label="Quantidade"></v-text-field>
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
import moment from "moment";
import { log } from "util";

export default {
  name: "VendaNova",
  data() {
    return {
      overlay: false,
      elevation: 2,
      heightSup: this.isMobile() ? 0 : 172,
      heightInf: this.isMobile() ? 0 : 348,
      categorias: [],
      produtos: [],
      clientes: [],
      cesta: [],
      total: 0,
      searchProduto: "",
      searchCliente: "",
      snackbar: false,
      snackbarMessage: "",
      snackbarColor: "green",
      snackbarTimeout: 2000,
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
      estadoBotao: false,
      isPrazo: false,
      qntParcelas: 2,
      data_atual: new Date().toISOString().substr(0, 10),
      data_modificada_formatada: new Date().toLocaleDateString(),
      data_modificada: null,
      menu: false,
      modalDataParcela: false,
      periodos: ["Semana", "Quinzena", "Mês"],
      periodo: "Mês",
      datas_parcelas: []
    };
  },
  methods: {
    changeOverlay() {
      this.overlay = !this.overlay;
    },
    salvarDataParcela(data) {
      this.data_modificada_formatada = `${data.split("-")[2]}/${
        data.split("-")[1]
      }/${data.split("-")[0]}`;
      this.data_modificada = `${this.data_modificada_formatada.split("/")[2]}-${
        this.data_modificada_formatada.split("/")[1]
      }-${this.data_modificada_formatada.split("/")[0]}`;
      this.data_atual = this.data_modificada;
      this.modalDataParcela = false;
    },
    bindDisabled() {
      if (
        this.editedItem.quantidade >
          this.cesta[this.editedItem.index].produto.amount ||
        Number(this.editedItem.quantidade) <= 0
      ) {
        this.estadoBotao = true;
      } else {
        this.estadoBotao = false;
      }
      if (Number(this.editedItem.quantidade) < 0) {
        this.editedItem.quantidade = 0;
      }
    },
    salvarCesta: function() {
      this.overlay = true;
      let idVenda = null;
      axios
        .post(`${this.api_url}/sell`, {
          sell: {
            date_complete: `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
            date_day: new Date().toLocaleDateString().split("/")[0],
            date_month: new Date().toLocaleDateString().split("/")[1],
            date_year: new Date().toLocaleDateString().split("/")[2],
            customer: this.clienteSelected._id,
            total: this.total,
            total_paid: this.total,
            isPrazo: this.isPrazo
          }
        })
        .then(response => {
          idVenda = response.data._id;
          this.cesta.forEach(item => {
            return axios.post(`${this.api_url}/sellitem`, {
              sellItem: {
                sell: response.data._id,
                product: item.produto._id,
                price: item.produto.price_sell,
                amount: item.quantidade,
                total: item.total
              }
            });
          });
        })
        .catch(() => {
          this.showSnackbar("Falha ao salvar compra", "red");
          console.log("falha ao salvar à vista");
        })
        .finally(() => {
          if (this.isPrazo) {
            let idParcela = null;
            axios
              .post(`${this.api_url}/split`, {
                split: {
                  period: this.periodo,
                  amount: this.total,
                  sell: idVenda
                }
              })
              .then(response => {
                idParcela = response.data._id;
              })
              .catch(() => {
                console.log("Falha ao cadastrar parcela");
              })
              .finally(() => {
                let dataMoment = moment().set({
                  year: Number(this.data_modificada.split("-")[0]),
                  month: Number(this.data_modificada.split("-")[1]) - 1,
                  date: Number(this.data_modificada.split("-")[2]),
                  timezone: "America/Sao_Paulo"
                });
                let datasParcelas = [];
                datasParcelas.push(this.data_modificada_formatada);
                for (let index = 1; index < this.qntParcelas; index++) {
                  if (this.periodo === "Mês") {
                    dataMoment.add(1, "month");
                  } else if (this.periodo === "Quinzena") {
                    dataMoment.add(15, "days");
                  } else {
                    dataMoment.add(1, "week");
                  }
                  const date = dataMoment
                    .format("L")
                    .toString()
                    .split("/");
                  datasParcelas.push(`${date[1]}/${date[0]}/${date[2]}`);
                }

                datasParcelas.forEach((element, index) => {
                  return axios.post(`${this.api_url}/splititem`, {
                      splitItem: {
                        current: index + 1,
                        amount: datasParcelas.length,
                        date: element,
                        price: (Number(this.total) / datasParcelas.length).toFixed(2),
                        split: idParcela
                      }
                    })
                });
                this.limparCestaAposSalvarCompra();
              });
          } else {
            this.limparCestaAposSalvarCompra();
          }
        });
      this.overlay = false;
      this.showSnackbar("Compra salva com sucesso");
    },
    showSnackbar(message, color = "green") {
      this.snackbar = true;
      this.snackbarColor = color;
      this.snackbarMessage = message;
      setTimeout(() => {
        this.snackbarMessage = "";
      }, this.snackbarTimeout + 100);
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
    isMobile() {
      if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      ) {
        return true;
      } else {
        return false;
      }
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
        this.isPrazo = false;
      }
    },
    limparCestaAposSalvarCompra() {
      this.cesta = [];
      this.total = 0;
      this.produtos = [];
      this.unsetCliente();
      this.searchCliente = "";
      this.searchProduto = "";
      this.isPrazo = false;
      this.periodo = "Mês";
      this.qntParcelas = 2;
    },
    getCategorias() {
      this.changeOverlay();
      axios.get(`${this.api_url}/productcategory`).then(response => {
        this.categorias = response.data;
        this.categorias.push({ _id: "todos", name: "Todos" });
        this.categorias.push({ _id: "nenhum", name: "Nenhum" });
        this.changeOverlay();
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
    this.data_modificada = new Date().toISOString().substr(0, 10);
    this.getCategorias();
  }
};
</script>
