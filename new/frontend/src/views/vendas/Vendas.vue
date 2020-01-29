<template>
  <div>
    <v-dialog v-model="modalParcelas" persistent>
      <v-card class="mx-auto">
        <v-container fluid>
          <v-row dense>
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
                    <v-btn color="primary" :disabled="parcela.isPaga" @click="receberParcela(parcela)">Receber</v-btn>
                    <!-- <v-btn color="primary" @click="diffDatas(parcela.data)">Teste</v-btn> -->
                  </v-flex>
                </v-layout>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions>
          <v-layout>
            <v-flex xs12 class="text-center">
              <v-btn class="text-center mb-3" text color="primary" @click="modalParcelas = false">Fechar</v-btn>
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
        <v-data-table :headers="cabecalhos" :items="produtos" sort-by="nome" :search="pesquisar" :page.sync="paginaAtual" :items-per-page="Number(itensPorPagina)" hide-default-footer :page-count="numeroPaginas">
          <template v-slot:item.isPrazo="{ item }">
            <v-icon :color="item.isPrazo ? 'orange' : 'green'">
              {{ item.isPrazo ? "mdi-credit-card-clock-outline" : "mdi-currency-brl" }}
            </v-icon>
          </template>
          <template v-slot:item.total="{ item }">
            {{ Number(item.total.toFixed(2)).toLocaleString("pt-BR", {style: "currency", currency:"BRL"}) }}
          </template>
          <template v-slot:item.action="{ item }">
            <v-icon small color="info" @click="abrirItem(item)" v-if="item.isPrazo">
              mdi-eye
            </v-icon>
            <!-- <v-icon small color="error" class="ml-1" @click="deletarItem(item)">
              mdi-close
            </v-icon> -->
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
      cards: [
        {
          title: "Pre-fab homes",
          src: "https://cdn.vuetifyjs.com/images/cards/house.jpg",
          flex: 12
        },
        {
          title: "Favorite road trips",
          src: "https://cdn.vuetifyjs.com/images/cards/road.jpg",
          flex: 6
        },
        {
          title: "Best airlines",
          src: "https://cdn.vuetifyjs.com/images/cards/plane.jpg",
          flex: 6
        }
      ],
      endPoint: "venda",
      carregandoCategorias: false,
      categorias: [],
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
      produtos: [],
      parcelas: [],
      cabecalhos: [
        { text: "Data", align: "left", value: "data" },
        { text: "Cliente", value: "cliente.nome" },
        { text: "Vendido por", value: "vendedor.nome" },
        { text: "Tipo", value: "isPrazo" },
        { text: "Total", value: "total" },
        { text: "Ação", value: "action", align: "right", sortable: false }
      ],
      itemAbertoID: ""
    };
  },
  created() {
    this.listarItens();
    this.listarCategorias();
  },
  methods: {
    diffDatas(data) {
      var data_formatada = `${data.split("/")[2]}-${data.split("/")[1]}-${
        data.split("/")[0]
      }`;
      var m = moment(data_formatada); // YYYY-MM-DD
      var today = moment().startOf("day");
      var days = Math.round(moment.duration(today - m).asDays());
      return days;
    },
    receberParcela(parcela) {
      // console.log(parcela);
      this.$axios
        .get(`parcela/receber/${parcela._id}`)
        .then(response => {
          this.$axios
            .get(`parcela/venda/${this.itemAbertoID}`)
            .then(response => {
              this.parcelas = response.data;
              // this.modalParcelas = true;
              this.mostrarToast("Parcela recebida");
            })
            .catch(() => {
              this.mostrarToast(
                "Falha ao recuperar dados das parcelas",
                "error"
              );
              // this.fecharModal();
            });
        })
        .catch(() => {
          this.mostrarToast("Falha ao receber parcela", "error");
          // this.fecharModal();
        });
    },
    listarItens(n = false) {
      this.$axios
        .get(
          `${this.endPoint}?page=${n ? 1 : this.paginaAtual}&limit=${
            this.itensPorPagina
          }`
        )
        .then(response => {
          this.produtos = response.data.docs;
          this.paginaAtual = n ? 1 : response.data.page;
          this.numeroPaginas = response.data.totalPages;
          this.itensPorPagina = String(response.data.limit);
        })
        .catch(() => {
          this.mostrarToast("Falha ao recuperar dados dos produtos", "error");
          this.fecharModal();
        });
    },
    listarCategorias() {
      this.$axios
        .get(`categoria/todas`)
        .then(response => {
          this.categorias = response.data;
        })
        .catch(() => {
          this.mostrarToast("Falha ao recuperar dados dos produtos", "error");
          this.fecharModal();
        });
    },
    novaVenda() {
      this.$router.push("/novavenda");
    },
    abrirItem(item) {
      this.itemAbertoID = item._id;
      this.$axios
        .get(`parcela/venda/${item._id}`)
        .then(response => {
          this.parcelas = response.data;
          this.modalParcelas = true;
        })
        .catch(() => {
          this.mostrarToast("Falha ao recuperar dados das parcelas", "error");
          // this.fecharModal();
        });
      // this.modalDetalhar = true;
      // this.tituloModal = "Editar venda";
    },
    fecharModal() {
      this.modal = false;
      this.novoItem = false;
      setTimeout(() => {
        this.itemAtual.nome = "";
        this.itemAtual.quantidade = "";
        this.itemAtual.categoria = "";
        this.itemAtual.preco_compra = "";
        this.itemAtual.preco_revenda = "";
        this.itemAtual.id = "";
      }, 1000);
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
          .post(`${this.endPoint}`, { ...this.itemAtual })
          .then(() => {
            this.mostrarToast("Produto criado com sucesso");
            this.fecharModal();
            this.listarItens();
          })
          .catch(() => {
            this.mostrarToast("Falha ao criar venda", "error");
            this.fecharModal();
          });
      } else {
        this.$axios
          .put(`${this.endPoint}/${this.itemAtual.id}`, { ...this.itemAtual })
          .then(() => {
            this.mostrarToast("Produto editado com sucesso");
            this.fecharModal();
            this.listarItens();
          })
          .catch(() => {
            this.mostrarToast("Falha ao editar venda", "error");
            this.fecharModal();
          });
      }
    },
    deletarItem(item) {
      if (confirm(`Deseja realmente deletar a venda?`)) {
        this.$axios
          .delete(`${this.endPoint}/${item._id}`)
          .then(() => {
            this.mostrarToast("Venda deletada com sucesso");
            this.fecharModal();
            this.listarItens();
          })
          .catch(() => {
            this.mostrarToast("Falha ao deletar venda", "error");
            this.fecharModal();
          });
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
