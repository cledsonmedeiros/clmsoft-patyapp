<template>
  <div>
    <v-dialog v-model="modalParcelas" scrollable fullscreen hide-overlay transition="dialog-bottom-transition" persistent>
      <v-card class="mx-auto">
        <v-container fluid>
          <v-row dense v-if="parcelas.length > 0">
            <v-col v-for="(parcela, index) in parcelas" :key="parcela._id" cols="12" sm="12">
              <v-card>
                <v-layout row wrap class="pa-3">
                  <v-flex xs12 md2 class="text-center">
                    <div class="caption grey--text">Vencimento</div>
                    <div>{{parcela.data}}</div>
                  </v-flex>
                  <v-flex xs12 md2 class="text-center">
                    <div class="caption grey--text">Número</div>
                    <div>{{(index + 1)}}</div>
                  </v-flex>
                  <v-flex xs12 md2 class="text-center">
                    <div class="caption grey--text">Dias em atraso</div>
                    <div>{{ diffDatas(parcela.data) < 1 ? 'Nenhum' : diffDatas(parcela.data) }}</div>
                  </v-flex>
                  <v-flex xs12 md2 class="text-center">
                    <div class="caption grey--text">Valor</div>
                    <div>{{Number(parcela.valor.toFixed(2)).toLocaleString("pt-BR", {style: "currency", currency:"BRL"})}}</div>
                  </v-flex>
                  <v-flex xs12 md2 class="text-center">
                    <div class="caption grey--text">Status</div>
                    <span :class="parcela.isPaga ? 'green--text' : 'primary--text'">{{parcela.isPaga ? 'Pago' : 'Pendente'}}</span>
                  </v-flex>
                  <v-flex xs12 md2 class="text-center">
                    <div class="caption grey--text">Ação</div>
                    <v-btn v-if="!parcela.isPaga" color="primary" :disabled="index === 0 ? parcela.isPaga : parcelas[index-1].isPaga === false" @click="receberParcela(parcela, index === (parcelas.length - 1))">Receber</v-btn>
                    <v-btn v-else color="primary" disabled>Recebida</v-btn>
                  </v-flex>
                </v-layout>
              </v-card>
            </v-col>
          </v-row>
          <v-row dense v-if="itensVenda.length > 0">
            <v-col v-for="item in itensVenda" :key="item._id" cols="12" sm="12">
              <v-card class="purple--lighten-1">
                <v-layout row wrap class="pa-3">
                  <v-flex xs12 md3 class="text-center">
                    <div class="caption grey--text">Produto</div>
                    <div>{{item.produto.nome}}</div>
                  </v-flex>
                  <v-flex xs12 md3 class="text-center">
                    <div class="caption grey--text">Quantidade</div>
                    <div>{{item.quantidade}}</div>
                  </v-flex>
                  <v-flex xs12 md3 class="text-center">
                    <div class="caption grey--text">Preço</div>
                    <div>{{Number(item.preco.toFixed(2)).toLocaleString("pt-BR", {style: "currency", currency:"BRL"})}}</div>
                  </v-flex>
                  <v-flex xs12 md3 class="text-center">
                    <div class="caption grey--text">Subtotal</div>
                    <div>{{Number((item.preco * item.quantidade).toFixed(2)).toLocaleString("pt-BR", {style: "currency", currency:"BRL"})}}</div>
                  </v-flex>
                </v-layout>
              </v-card>
            </v-col>
            <v-col cols="12" sm="12">
              <v-card class="purple--lighten-1">
                <v-layout row wrap class="pa-3">
                  <v-spacer></v-spacer>
                  <v-flex xs12 md3 class="text-center">
                    <div class="caption grey--text">Total</div>
                    <div>{{Number(itemAbertoTotal.toFixed(2)).toLocaleString("pt-BR", {style: "currency", currency:"BRL"})}}</div>
                  </v-flex>
                </v-layout>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions>
          <v-layout>
            <v-flex xs12 class="text-center">
              <v-btn class="text-center mb-3" text color="primary" @click="fecharModal()">Fechar</v-btn>
            </v-flex>
          </v-layout>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-card>
      <v-card-title>
        <v-layout row wrap>
          <v-flex xs12 sm6 class="d-flex align-center pl-4">
            <h1 class="headline">Vendas</h1>
            <v-btn small elevation="1" color="primary" class="ml-2" @click="novaVenda()">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-flex>
          <v-flex xs12 sm6>
            <v-text-field v-model="pesquisar" append-icon="mdi-magnify" label="Pesquisar" single-line hide-details></v-text-field>
          </v-flex>
        </v-layout>
      </v-card-title>
      <div>
        <v-data-table :headers="cabecalhos" :items="vendas" sort-by="nome" :search="pesquisar" :page.sync="paginaAtual" :items-per-page="Number(itensPorPagina)" hide-default-footer :page-count="numeroPaginas">
          <template v-slot:item.isPrazo="{ item }">
            <v-icon :color="item.isPrazo ? 'orange' : 'green'">
              {{ item.isPrazo ? "mdi-credit-card-clock-outline" : "mdi-currency-brl" }}
            </v-icon>
          </template>
          <template v-slot:item.isConcluida="{ item }">
            {{ item.isConcluida ? "Finalizada" : "Em andamento" }}
          </template>
          <template v-slot:item.total="{ item }">
            {{ Number(item.total.toFixed(2)).toLocaleString("pt-BR", {style: "currency", currency:"BRL"}) }}
          </template>
          <template v-slot:item.createdAt="{ item }">
            {{ new Date(item.createdAt).toLocaleString() }}
          </template>
          <template v-slot:item.action="{ item }">
            <v-icon small color="info" @click="abrirItem(item)">
              mdi-eye
            </v-icon>
            <v-icon small color="error" class="ml-1" @click="deletarItem(item)">
              mdi-close
            </v-icon>
          </template>
        </v-data-table>
        <div class="text-center pt-5 mx-5">
          <v-pagination v-model="paginaAtual" :length="numeroPaginas" @input="listarItens()"></v-pagination>
          <v-select :items="numeroElementos" label="Itens por página" v-model="itensPorPagina" @change="listarItens(n=true)"></v-select>
        </div>
      </div>
    </v-card>
  </div>
</template>
<script>
import { mask } from "vue-the-mask";
import moment from "moment";

export default {
  name: "Vendas",
  directives: {
    mask
  },
  components: {},
  data() {
    return {
      itemAbertoTotal: 0,
      endPoint: "venda",
      carregandoCategorias: false,
      categorias: [],
      itensVenda: [],
      pesquisaCategoria: "",
      price: 0,
      money: {
        decimal: ",",
        thousands: ".",
        precision: 2
      },
      numeroElementos: ["3", "5", "10"],
      paginaAtual: 1,
      numeroPaginas: 1,
      itensPorPagina: "5",
      tituloModal: "",
      modal: false,
      modalParcelas: false,
      pesquisar: "",
      novoItem: false,
      itemAtual: {
        nome: "",
        quantidade: "",
        categoria: "",
        preco_compra: "",
        preco_revenda: "",
        id: ""
      },
      vendas: [],
      parcelas: [],
      cabecalhos: [
        { text: "Data", align: "left", value: "createdAt" },
        { text: "Cliente", value: "cliente.nome" },
        { text: "Vendido por", value: "vendedor.nome" },
        { text: "Tipo", value: "isPrazo" },
        { text: "Status", value: "isConcluida" },
        { text: "Total", value: "total" },
        { text: "Ação", value: "action", align: "right", sortable: false }
      ],
      itemAbertoID: ""
    };
  },
  created() {
    this.listarItens();
  },
  methods: {
    diffDatas(data) {
      let data_formatada = `${data.split("/")[2]}-${data.split("/")[1]}-${
        data.split("/")[0]
      }`;
      let m = moment(data_formatada); // YYYY-MM-DD
      let today = moment().startOf("day");
      let days = Math.round(moment.duration(today - m).asDays());
      return days;
    },
    receberParcela(parcela, isUltima = false) {
      this.$axios
        .get(`parcela/receber/${parcela._id}`)
        .then(response => {
          this.$axios
            .get(`parcela/venda/${this.itemAbertoID}`)
            .then(response => {
              this.parcelas = response.data;
              this.mostrarToast("Parcela recebida com sucesso");

              if (isUltima) {
                this.$axios
                  .put(`venda/${this.itemAbertoID}`, { isConcluida: true })
                  .then(() => {
                    this.listarItens();
                  })
                  .catch(err => {
                    if (err.response.status === 403) {
                      this.mostrarToast("Sessão expirada", "error");
                      localStorage.clear();
                      this.$router.push("/");
                    } else if (err.response.status === 400) {
                      this.mostrarToast("Credenciais não informadas", "error");
                      localStorage.clear();
                      this.$router.push("/");
                    } else {
                      this.mostrarToast("Falha ao atualizar venda", "error");
                    }
                  });
              }
            })
            .catch(err => {
              if (err.response.status === 403) {
                this.mostrarToast("Sessão expirada", "error");
                localStorage.clear();
                this.$router.push("/");
              } else if (err.response.status === 400) {
                this.mostrarToast("Credenciais não informadas", "error");
                localStorage.clear();
                this.$router.push("/");
              } else {
                this.mostrarToast("Falha ao listar parcelas", "error");
              }
            });
        })
        .catch(err => {
          if (err.response.status === 403) {
            this.mostrarToast("Sessão expirada", "error");
            localStorage.clear();
            this.$router.push("/");
          } else if (err.response.status === 400) {
            this.mostrarToast("Credenciais não informadas", "error");
            localStorage.clear();
            this.$router.push("/");
          } else {
            this.mostrarToast("Falha ao receber parcela", "error");
          }
        });
    },
    listarItens(n = false) {
      this.$axios
        .get(
          `venda?page=${n ? 1 : this.paginaAtual}&limit=${this.itensPorPagina}`
        )
        .then(response => {
          this.vendas = response.data.docs;
          this.paginaAtual = n ? 1 : response.data.page;
          this.numeroPaginas = response.data.totalPages;
          this.itensPorPagina = String(response.data.limit);
        })
        .catch(err => {
          if (err.response.status === 403) {
            this.mostrarToast("Sessão expirada", "error");
            localStorage.clear();
            this.$router.push("/");
          } else if (err.response.status === 400) {
            this.mostrarToast("Credenciais não informadas", "error");
            localStorage.clear();
            this.$router.push("/");
          } else {
            this.mostrarToast("Falha ao listar vendas", "error");
          }
          this.fecharModal();
        });
    },
    novaVenda() {
      this.$router.push("/novavenda");
    },
    abrirItem(item) {
      this.itemAbertoTotal = item.total;
      this.itemAbertoID = item._id;
      this.$axios
        .get(`parcela/venda/${item._id}`)
        .then(response => {
          this.parcelas = response.data;

          this.$axios
            .get(`item/venda/${item._id}`)
            .then(response2 => {
              this.itensVenda = response2.data;
              this.modalParcelas = true;
            })
            .catch(err => {
              if (err.response.status === 403) {
                this.mostrarToast("Sessão expirada", "error");
                localStorage.clear();
                this.$router.push("/");
              } else if (err.response.status === 400) {
                this.mostrarToast("Credenciais não informadas", "error");
                localStorage.clear();
                this.$router.push("/");
              } else {
                this.mostrarToast("Falha ao listar itens de venda", "error");
              }
            });
        })
        .catch(err => {
          if (err.response.status === 403) {
            this.mostrarToast("Sessão expirada", "error");
            localStorage.clear();
            this.$router.push("/");
          } else if (err.response.status === 400) {
            this.mostrarToast("Credenciais não informadas", "error");
            localStorage.clear();
            this.$router.push("/");
          } else {
            this.mostrarToast("Falha ao listar parcelas", "error");
          }
        });
    },
    fecharModal() {
      this.itemAbertoID = "";
      this.itemAbertoTotal = 0;
      this.modalParcelas = false;
      this.parcelas = [];
      this.itensVenda = [];
    },
    salvarItem() {
      this.itemAtual.preco_compra = Number(
        String(this.itemAtual.preco_compra)
          .split("R$")[1]
          .trim()
          .split(".")
          .join("")
          .replace(",", ".")
      );
      this.itemAtual.preco_revenda = Number(
        String(this.itemAtual.preco_revenda)
          .split("R$")[1]
          .trim()
          .split(".")
          .join("")
          .replace(",", ".")
      );

      if (this.novoItem) {
        delete this.itemAtual.id;

        this.$axios
          .post(`venda`, { ...this.itemAtual })
          .then(() => {
            this.mostrarToast("Produto criado com sucesso");
            this.fecharModal();
            this.listarItens();
          })
          .catch(err => {
            if (err.response.status === 403) {
              this.mostrarToast("Sessão expirada", "error");
              localStorage.clear();
              this.$router.push("/");
            } else if (err.response.status === 400) {
              this.mostrarToast("Credenciais não informadas", "error");
              localStorage.clear();
              this.$router.push("/");
            } else {
              this.mostrarToast("Falha ao criar venda", "error");
            }
            this.fecharModal();
          });
      } else {
        this.$axios
          .put(`venda/${this.itemAtual.id}`, { ...this.itemAtual })
          .then(() => {
            this.mostrarToast("Produto editado com sucesso");
            this.fecharModal();
            this.listarItens();
          })
          .catch(err => {
            if (err.response.status === 403) {
              this.mostrarToast("Sessão expirada", "error");
              localStorage.clear();
              this.$router.push("/");
            } else if (err.response.status === 400) {
              this.mostrarToast("Credenciais não informadas", "error");
              localStorage.clear();
              this.$router.push("/");
            } else {
              this.mostrarToast("Falha ao editar venda", "error");
            }
            this.fecharModal();
          });
      }
    },
    deletarItem(item) {
      if (confirm(`Deseja realmente deletar a venda?`)) {
        let idVenda = item._id;
        let parcelado = item.isPrazo;

        let idItens = [];

        this.$axios
          .get(`item/venda/${idVenda}`)
          .then(response => {
            idItens = response.data;
            this.$axios
              .delete(`item/venda/${idVenda}`)
              .then(() => {
                idItens.forEach((itemVenda, indexItemVenda) => {
                  this.$axios
                    .get(
                      `produto/${itemVenda.produto._id}/quantidade/mais/${itemVenda.quantidade}`
                    )
                    .then(() => {
                      return;
                    })
                    .catch(err => {
                      if (err.response.status === 403) {
                        this.mostrarToast("Sessão expirada", "error");
                        localStorage.clear();
                        this.$router.push("/");
                      } else if (err.response.status === 400) {
                        this.mostrarToast(
                          "Credenciais não informadas",
                          "error"
                        );
                        localStorage.clear();
                        this.$router.push("/");
                      } else {
                        this.mostrarToast(
                          "Falha ao alterar quantidade do produto",
                          "error"
                        );
                      }
                    });
                });
              })
              .catch(err => {
                if (err.response.status === 403) {
                  this.mostrarToast("Sessão expirada", "error");
                  localStorage.clear();
                  this.$router.push("/");
                } else if (err.response.status === 400) {
                  this.mostrarToast("Credenciais não informadas", "error");
                  localStorage.clear();
                  this.$router.push("/");
                } else {
                  this.mostrarToast("Falha ao deletar item de venda", "error");
                }
              });
          })
          .catch(err => {
            if (err.response.status === 403) {
              this.mostrarToast("Sessão expirada", "error");
              localStorage.clear();
              this.$router.push("/");
            } else if (err.response.status === 400) {
              this.mostrarToast("Credenciais não informadas", "error");
              localStorage.clear();
              this.$router.push("/");
            } else {
              this.mostrarToast("Falha ao listar itens de venda", "error");
            }
          });

        if (parcelado) {
          this.$axios
            .delete(`parcela/venda/${idVenda}`)
            .then(() => {
              this.$axios
                .delete(`venda/${idVenda}`)
                .then(() => {
                  this.mostrarToast("Venda deletada com sucesso");
                  this.fecharModal();
                  this.listarItens();
                })
                .catch(err => {
                  if (err.response.status === 403) {
                    this.mostrarToast("Sessão expirada", "error");
                    localStorage.clear();
                    this.$router.push("/");
                  } else if (err.response.status === 400) {
                    this.mostrarToast("Credenciais não informadas", "error");
                    localStorage.clear();
                    this.$router.push("/");
                  } else {
                    this.mostrarToast(
                      "Falha ao deletar parcelas da venda",
                      "error"
                    );
                  }
                  this.fecharModal();
                });
            })
            .catch(err => {
              if (err.response.status === 403) {
                this.mostrarToast("Sessão expirada", "error");
                localStorage.clear();
                this.$router.push("/");
              } else if (err.response.status === 400) {
                this.mostrarToast("Credenciais não informadas", "error");
                localStorage.clear();
                this.$router.push("/");
              } else {
                this.mostrarToast("Falha ao deletar venda", "error");
              }
              this.fecharModal();
            });
        } else {
          this.$axios
            .delete(`venda/${idVenda}`)
            .then(() => {
              this.mostrarToast("Venda deletada com sucesso");
              this.fecharModal();
              this.listarItens();
            })
            .catch(err => {
              if (err.response.status === 403) {
                this.mostrarToast("Sessão expirada", "error");
                localStorage.clear();
                this.$router.push("/");
              } else if (err.response.status === 400) {
                this.mostrarToast("Credenciais não informadas", "error");
                localStorage.clear();
                this.$router.push("/");
              } else {
                this.mostrarToast(
                  "Falha ao deletar parcelas da venda",
                  "error"
                );
              }
              this.fecharModal();
            });
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
    }
  }
};
</script>
