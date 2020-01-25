<template>
  <div>
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
          <template v-slot:item.preco_compra="{ item }">
            {{ Number(item.preco_compra.toFixed(2)).toLocaleString("pt-BR", {style: "currency", currency:"BRL"}) }}
          </template>
          <template v-slot:item.preco_revenda="{ item }">
            {{ Number(item.preco_revenda.toFixed(2)).toLocaleString("pt-BR", {style: "currency", currency:"BRL"}) }}
          </template>
          <template v-slot:item.action="{ item }">
            <v-icon small color="info" @click="abrirItem(item)">
              mdi-pencil
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

export default {
  name: "Produtos",
  directives: {
    mask
  },
  components: {},
  data() {
    return {
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
      cabecalhos: [
        { text: "Nome", align: "left", value: "nome" },
        { text: "Quantidade", value: "quantidade" },
        { text: "Categoria", value: "categoria.nome" },
        { text: "Preço de compra", value: "preco_compra" },
        { text: "Preço de revenda", value: "preco_revenda" },
        { text: "Ação", value: "action", align: "right", sortable: false }
      ]
    };
  },
  created() {
    this.listarItens();
    this.listarCategorias();
  },
  methods: {
    listarItens(n = false) {
      this.$axios
        .get(
          `produto?page=${n ? 1 : this.paginaAtual}&limit=${
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
      this.$router.push('/novavenda');
    },
    abrirItem(item) {
      this.modal = true;
      this.tituloModal = "Editar produto";
      this.itemAtual.nome = item.nome;
      this.itemAtual.quantidade = item.quantidade;
      this.itemAtual.categoria = item.categoria._id;
      this.itemAtual.id = item._id;
      setTimeout(() => {
        this.itemAtual.preco_compra =
          "R$ " + String(item.preco_compra.toFixed(2)).replace(".", ",");
        this.itemAtual.preco_revenda =
          "R$ " + String(item.preco_revenda.toFixed(2)).replace(".", ",");
      }, 100);
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
          .post(`produto`, { ...this.itemAtual })
          .then(() => {
            this.mostrarToast("Produto criado com sucesso");
            this.fecharModal();
            this.listarItens();
          })
          .catch(() => {
            this.mostrarToast("Falha ao criar produto", "error");
            this.fecharModal();
          });
      } else {
        this.$axios
          .put(`produto/${this.itemAtual.id}`, { ...this.itemAtual })
          .then(() => {
            this.mostrarToast("Produto editado com sucesso");
            this.fecharModal();
            this.listarItens();
          })
          .catch(() => {
            this.mostrarToast("Falha ao editar produto", "error");
            this.fecharModal();
          });
      }
    },
    deletarItem(item) {
      if (confirm(`Deseja realmente deletar o produto ${item.nome}?`)) {
        this.$axios
          .delete(`produto/${item._id}`)
          .then(() => {
            this.mostrarToast("Produto deletado com sucesso");
            this.fecharModal();
            this.listarItens();
          })
          .catch(() => {
            this.mostrarToast("Falha ao deletar produto", "error");
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
