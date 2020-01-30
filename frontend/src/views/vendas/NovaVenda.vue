<template>
  <div>
    <v-dialog v-model="modalItemCesta" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{itemCestaAtual.nome}}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="12" md="6">
                <v-text-field label="Preço" v-model="itemCestaAtual.preco" type="number" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="6">
                <v-text-field label="Quantidade" v-model="itemCestaAtual.qtdVenda" type="number" required @input="verificarQtdEstoque()" :hint="estadoBtnAddItem ? itemCestaAtual.qtdVenda < 1 ? `Quantidade mínima: 1` : `Quantidade em estoque: ${itemCestaAtual.qtdEstoque}` : ''" persistent-hint></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="fecharItemCesta()">Fechar</v-btn>
          <v-btn color="primary" text @click="verificarCestaAntesAddItem()" :disabled="estadoBtnAddItem">Adicionar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-stepper v-model="passoAtual">
      <v-stepper-header>
        <v-stepper-step :alt-labels="true" :key="`${passoAtual}-step`" :complete="true" :complete-icon="`mdi-numeric-${passoAtual}`" :step="passoAtual">
          <span v-if="passoAtual === 1">Cliente</span>
          <span v-if="passoAtual === 2">Produtos</span>
          <span v-if="passoAtual === 3">Forma de pagamento</span>
        </v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content v-for="passo in quantidadePassos" :key="`${passo}-content`" :step="passo">
          <v-card elevation="0" v-if="passo === 1">
            <v-autocomplete v-model="itemAtual.cliente" id="cliente" :loading="carregandoClientes" :items="clientes" @change="habilitarBtnAvancar(passo)" :search-input.sync="pesquisaCliente" cache-items hide-no-data clearable item-text="nome" item-value="_id" label="Cliente" autocomplete="off" flat></v-autocomplete>
          </v-card>
          <v-card v-if="passo === 2" elevation="0" class="mb-2">
            <v-container fluid class="px-1" style="padding: 0">
              <v-row>
                <v-col cols="12" xs="12" style="padding-top: 0;">
                  <v-card elevation="2">
                    <v-card-text>
                      <div>
                        Produtos
                        <v-text-field color="purple" v-model="pesquisaProduto" append-icon="mdi-magnify" label="Pesquisar" single-line hint="Pesquisar produto" persistent-hint autocomplete="off"></v-text-field>
                      </div>
                      <div>
                        <v-btn rounded small color="purple" class="mt-4 mr-2" dark v-for="produto in produtos" @click="abrirItemCesta(produto)" v-bind:key="produto._id">{{produto.nome}} - {{Number(produto.preco_revenda.toFixed(2)).toLocaleString("pt-BR", {style: "currency", currency:"BRL"})}}</v-btn>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12" xs="12" style="padding-top: 0;" v-if="cesta.length > 0">
                  <v-card elevation="2">
                    <v-card-text>
                      <div>
                        Itens
                      </div>
                      <div>
                        <v-btn rounded small color="purple" class="mt-4 mr-2" dark v-for="item in cesta" @click="deletarItemCesta(item)" v-bind:key="item._id">{{item.produto.nome}} - {{item.quantidade}} x {{Number(item.preco.toFixed(2)).toLocaleString("pt-BR", {style: "currency", currency:"BRL"})}}</v-btn>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12" xs="12" style="padding-top: 0;">
                  <v-card elevation="2">
                    <v-card-text class="ma-0">
                      <div>Cesta</div>
                      <div>
                        Total:
                        <b>{{ Number(totalCesta.toFixed(2)).toLocaleString("pt-BR", {style: "currency", currency:"BRL"}) }}</b>
                        <br />
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
          <v-card v-if="passo === 3" elevation="0">
            <v-container fluid class="px-1" style="padding: 0">
              <v-row>
                <v-col cols="12" xs="12" style="padding-top: 0; padding-bottom: 0;">
                  <v-card elevation="0">
                    <v-card-text class="ma-0" style="padding-bottom: 0px;">
                      <div class="mx-3">
                        <v-layout row>
                          <v-flex xs12 :md3="isPrazo" class="pr-3">
                            <v-select :items="metodosPagamento" v-model="isPrazo" label="Método" item-text="nome" item-value="valor"></v-select>
                          </v-flex>
                          <v-flex v-if="isPrazo" xs12 md3 class="pr-3">
                            <v-text-field color="purple" type="number" v-model="qntParcelas" label="Parcelas"></v-text-field>
                          </v-flex>
                          <v-flex v-if="isPrazo" xs12 md3 class="pr-3">
                            <v-select :items="periodos" v-model="periodo" label="Período"></v-select>
                          </v-flex>
                          <v-flex v-if="isPrazo" xs12 md3>
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
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </v-card>

          <v-layout text-center wrap>
            <v-flex xs12 md4>
              <v-btn class="mb-2" color="error" dark @click="cancelarVendaAtual()">Cancelar</v-btn>
            </v-flex>
            <v-flex xs12 md4>
              <v-btn class="mb-2" color="primary" v-if="passoAtual !== 1" @click="anteriorPasso(passo)">Voltar</v-btn>
            </v-flex>
            <v-flex xs12 md4>
              <v-btn color="primary" class="mt-3" v-if="passoAtual !== 3" @click="proximoPasso(passo)" :disabled="estadoBtn">Avançar</v-btn>
              <!-- <v-btn class="mb-2" color="primary" v-if="passoAtual !== 3" @click="proximoPasso(passo)">Avançar</v-btn> -->
              <v-btn class="mb-2" color="primary" v-if="passoAtual === 3" @click="finalizarVenda()">Finalizar</v-btn>
            </v-flex>
          </v-layout>

        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "NovaVenda",
  data() {
    return {
      data_atual: new Date().toISOString().substr(0, 10),
      data_modificada_formatada: new Date().toLocaleDateString(),
      data_modificada: null,
      modalDataParcela: false,
      periodo: "Mês",
      periodos: ["Semana", "Quinzena", "Mês"],
      metodosPagamento: [
        { nome: "À vista", valor: false },
        { nome: "Parcelado", valor: true }
      ],
      qntParcelas: 2,
      isPrazo: false,
      endPoint: "venda",
      estadoBtnAddItem: false,
      estadoBtn: true,
      passoAtual: 1,
      quantidadePassos: 3,
      itemAtual: {
        cliente: "",
        _id: "",
        data: "",
        isPrazo: null,
        isConcluida: null,
        vendedor: "",
        total: 0
      },
      itemCestaAtual: {
        nome: "",
        id: "",
        preco: 0,
        qtdEstoque: 0,
        qtdVenda: 0
      },
      modalItemCesta: false,
      carregandoClientes: false,
      clientes: [],
      produtos: [],
      cesta: [],
      totalCesta: 0,
      pesquisaCliente: "",
      pesquisaProduto: ""
    };
  },
  watch: {
    quantidadePassos(val) {
      if (this.passoAtual > val) {
        this.passoAtual = val;
      }
    },
    pesquisaCliente(nome) {
      if (nome !== null && nome !== undefined && nome.length > 0) {
        this.$axios.get(`cliente/nome/${nome}`).then(response => {
          this.clientes = response.data;
        });
      }
    },
    isPrazo(valor) {
      this.$axios
        .put(`venda/${this.itemAtual._id}`, { isPrazo: valor })
        .then(() => {
          return;
        })
        .catch(() => {
          this.mostrarToast("Falha ao alterar tipo venda", "error");
        });
    },
    pesquisaProduto(nome) {
      let prods = [];
      if (nome !== null && nome !== undefined && nome.length > 0) {
        this.$axios.get(`produto/nome/${nome}`).then(response => {
          this.produtos = response.data;
        });
      }
    },
    cesta(val){
      if(val.length === 0){
        this.estadoBtn = true
      } else {
        this.estadoBtn = false
      }
      
    },
    "itemAtual.cliente"(cliente) {
      if (cliente !== null && cliente !== undefined && cliente.length === 24) {
        this.$axios
          .put(`${this.endPoint}/${this.itemAtual._id}`, { ...this.itemAtual })
          .then(() => {
            return;
          })
          .catch(() => {
            this.mostrarToast("Falha ao criar venda", "error");
          });
      }
    }
  },
  methods: {
    finalizarVenda() {
      if (!this.isPrazo) {
        this.$axios
          .put(`venda/${this.itemAtual._id}`, {
            isConcluida: true,
            total: this.totalCesta
          })
          .then(() => {
            this.mostrarToast("Venda finalizada");
            this.$router.push("/vendas");
            return;
          })
          .catch(() => {
            this.mostrarToast("Falha ao alterar tipo venda", "error");
          });
      } else {
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
          this.$axios
            .post(`parcela/`, {
              venda: this.itemAtual._id,
              data: element,
              valor: this.totalCesta / datasParcelas.length,
              isPaga: false,
              ordem: index
            })
            .then(() => {
              return;
            })
            .catch(() => {
              this.mostrarToast("Falha ao criar parcelas", "error");
            });
        });

        this.$axios
          .put(`venda/${this.itemAtual._id}`, {
            isConcluida: false,
            total: this.totalCesta
          })
          .then(() => {
            this.mostrarToast("Venda finalizada");
            this.$router.push("/vendas");
            return;
          })
          .catch(() => {
            this.mostrarToast("Falha ao alterar tipo venda", "error");
          });
      }
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
    verificarQtdEstoque() {
      if (
        this.itemCestaAtual.qtdVenda <= 0 ||
        this.itemCestaAtual.qtdVenda > this.itemCestaAtual.qtdEstoque
      ) {
        this.estadoBtnAddItem = true;
      } else {
        this.estadoBtnAddItem = false;
      }
    },
    proximoPasso(passo) {
      if (passo === this.quantidadePassos) {
        this.passoAtual = 3;
      } else {
        this.passoAtual = passo + 1;
        this.estadoBtn = true;
      }
    },
    anteriorPasso(passo) {
      if (passo === 1) {
        this.passoAtual = 1;
      } else {
        this.passoAtual = passo - 1;
      }

      if (this.passoAtual === 1 && this.itemAtual.cliente.length === 24) {
        this.estadoBtn = false;
      } else {
        this.estadoBtn = true;
      }
    },
    cancelarVendaAtual() {
      if (confirm("Deseja realmente cancelar esta venda?")) {
        this.cesta.forEach(element => {
          this.$axios
            .get(
              `produto/${element.produto._id}/quantidade/mais/${element.quantidade}`
            )
            .then(() => {
              return;
            })
            .catch(() => {
              this.mostrarToast("Falha ao atualizar estoque", "error");
            });
        });
        this.$axios
          .delete(`item/venda/${this.itemAtual._id}`)
          .then(response => {
            this.$axios
              .delete(`${this.endPoint}/${this.itemAtual._id}`, {
                ...this.itemAtual
              })
              .then(response => {
                window.history.back();
              })
              .catch(() => {
                this.mostrarToast("Falha ao cancelar venda", "error");
              });
          })
          .catch(() => {
            this.mostrarToast("Falha ao limpar cesta", "error");
          });
      }
    },
    listarClientes() {
      this.$axios
        .get(`cliente/todos`)
        .then(response => {
          this.clientes = response.data;
        })
        .catch(() => {
          this.mostrarToast(
            "Falha ao recuperar dados listarClienteTodos",
            "error"
          );
        });
    },
    listarCesta() {
      this.totalCesta = 0;
      this.$axios
        .get(`item/venda/${this.itemAtual._id}`)
        .then(response => {
          this.cesta = response.data;
          if (this.cesta.length > 0) {
            this.cesta.forEach(element => {
              this.totalCesta += element.preco * element.quantidade;
            });
          }
        })
        .catch(() => {
          this.mostrarToast("Falha ao recuperar dados listarCesta", "error");
        });
    },
    habilitarBtnAvancar(passo) {
      if (passo === 1) {
        if (
          this.itemAtual.cliente !== undefined &&
          this.itemAtual.cliente.length === 24
        ) {
          delete this.itemAtual.nome;
          this.estadoBtn = false;
        } else {
          this.estadoBtn = true;
        }
      }
    },
    mostrarToast(msg, tipo = "success") {
      this.$toast.open({
        message: msg,
        type: tipo,
        position: "bottom",
        duration: 3000,
        dismissible: true
      });
    },
    abrirItemCesta(produto) {
      this.itemCestaAtual.nome = produto.nome;
      this.itemCestaAtual.id = produto._id;
      this.itemCestaAtual.preco = produto.preco_revenda;
      this.itemCestaAtual.qtdEstoque = produto.quantidade;
      this.itemCestaAtual.qtdVenda = 1;
      this.modalItemCesta = true;
    },
    fecharItemCesta() {
      this.modalItemCesta = false;
      this.itemCestaAtual.nome = "";
      this.itemCestaAtual.id = "";
      this.itemCestaAtual.preco = 0;
      this.itemCestaAtual.qtdEstoque = 0;
      this.itemCestaAtual.qtdVenda = 1;
    },
    adicionarItemCesta() {
      this.$axios
        .post(`item`, {
          venda: this.itemAtual._id,
          produto: this.itemCestaAtual.id,
          quantidade: this.itemCestaAtual.qtdVenda,
          preco: this.itemCestaAtual.preco
        })
        .then(response => {
          this.$axios
            .get(
              `produto/${this.itemCestaAtual.id}/quantidade/menos/${this.itemCestaAtual.qtdVenda}`
            )
            .then(response => {
              this.listarCesta();
              this.modalItemCesta = false;
              this.mostrarToast("Item adicionado");

              this.pesquisaProduto = "";
              this.produtos = [];
            })
            .catch(() => {
              this.mostrarToast("Falha ao atualizar estoque", "error");
            });
        })
        .catch(() => {
          this.mostrarToast("Falha ao adicionar item", "error");
        });
    },
    verificarCestaAntesAddItem() {
      let flagProdutoDuplicado = false;

      if (this.cesta.length > 0) {
        for (let i = 0; i < this.cesta.length; i++) {
          const element = this.cesta[i];
          if (element.produto._id === this.itemCestaAtual.id) {
            flagProdutoDuplicado = true;
          }
        }

        if (flagProdutoDuplicado) {
          if (
            confirm("Produto já está presente na cesta, adicionar mesmo assim?")
          ) {
            this.adicionarItemCesta();
          } else {
            this.listarCesta();
            this.modalItemCesta = false;
            this.pesquisaProduto = "";
            this.produtos = [];
          }
        } else {
          this.adicionarItemCesta();
        }
      } else {
        this.adicionarItemCesta();
      }
    },
    deletarItemCesta(produto) {
      if (confirm("Deseja realmente deletar este item?")) {
        this.$axios
          .delete(`item/${produto._id}`)
          .then(response => {
            this.$axios
              .get(
                `produto/${produto.produto._id}/quantidade/mais/${produto.quantidade}`
              )
              .then(response => {
                this.listarCesta();
                this.modalItemCesta = false;
                this.mostrarToast("Item deletado");
              })
              .catch(() => {
                this.mostrarToast("Falha ao atualizar estoque", "error");
              });
          })
          .catch(() => {
            this.mostrarToast("Falha ao deletar item", "error");
          });
      }
    },
    deletarTodosItensCesta() {
      if (confirm("Deseja realmente limpar a cesta?")) {
        this.$axios
          .delete(`item/venda/${itemAtual._id}`)
          .then(response => {
            this.listarCesta();
            this.modalItemCesta = false;
            this.mostrarToast("Cesta limpada com sucesso");
          })
          .catch(() => {
            this.mostrarToast("Falha ao limpar cesta", "error");
          });
      }
    }
  },
  created() {
    this.data_modificada = new Date().toISOString().substr(0, 10);
    this.listarClientes();

    const novaVenda = {
      data: `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
      isPrazo: false,
      isConcluida: false,
      cliente: null,
      vendedor: localStorage.userID,
      total: 0
    };

    this.$axios
      .post(`${this.endPoint}`, { ...novaVenda })
      .then(response => {
        this.itemAtual._id = response.data._id;
        this.itemAtual.data = response.data.data;
        this.itemAtual.isPrazo = response.data.isPrazo;
        this.itemAtual.isConcluida = response.data.isConcluida;
        this.itemAtual.vendedor = response.data.vendedor;
        this.itemAtual.total = response.data.total;
        this.listarCesta();
      })
      .catch(() => {
        this.mostrarToast("Falha ao criar venda", "error");
      });
  }
};
</script>
