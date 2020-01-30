<template>
  <div>
    <v-dialog v-model="modal" scrollable fullscreen hide-overlay transition="dialog-bottom-transition" persistent>
      <v-card>
        <v-card-title>
          <span class="headline">{{tituloModal}}</span>
        </v-card-title>
        <v-card-text>
          <v-container fluid>
            <v-row>
              <v-col cols="12" sm="12">
                <v-text-field label="Nome" v-model="itemAtual.nome" id="nome" @keyup.enter="salvarItem()" autocomplete="off"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" text @click="deletarItem(itemAtual)" v-if="!novoItem" :disabled="categoriaTemProdutos">Deletar</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="fecharModal()">Fechar</v-btn>
          <v-btn color="primary" text @click="salvarItem()" :disabled="itemAtual.nome.length === 0">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-card>
      <v-card-title>
        <v-layout row wrap>
          <v-flex xs12 sm6 class="d-flex align-center pl-4">
            <h1 class="headline">Categorias</h1>
            <v-btn small elevation="1" color="primary" class="ml-2" @click="abrirModal()">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-flex>
          <v-flex xs12 sm6>
            <v-text-field v-model="pesquisar" append-icon="mdi-magnify" label="Pesquisar" single-line hide-details></v-text-field>
          </v-flex>
        </v-layout>
      </v-card-title>
      <div>
        <v-data-table :headers="cabecalhos" :items="categoriasprodutos" :search="pesquisar" :page.sync="paginaAtual" :items-per-page="Number(itensPorPagina)" hide-default-footer :page-count="numeroPaginas">
          <template v-slot:item.action="{ item }">
            <v-icon small color="info" @click="abrirItem(item)">
              mdi-pencil
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
export default {
  name: "CategoriaProduto",
  components: {},
  // mounted() {
  //   window.addEventListener("keypress", e => {
  //     console.log(e);

  //     console.log(String.fromCharCode(e.keyCode));
  //   });
  // },
  data() {
    return {
      categoriaTemProdutos: true,
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
        id: ""
      },
      categoriasprodutos: [],
      cabecalhos: [
        { text: "Nome", align: "left", value: "nome" },
        { text: "Ação", value: "action", align: "right", sortable: false }
      ]
    };
  },
  created() {
    this.listarItens();
  },
  methods: {
    listarItens(n = false) {
      this.$axios
        .get(
          `categoria?page=${n ? 1 : this.paginaAtual}&limit=${
            this.itensPorPagina
          }`
        )
        .then(response => {
          this.categoriasprodutos = response.data.docs;
          this.paginaAtual = n ? 1 : response.data.page;
          this.numeroPaginas = response.data.totalPages;
          this.itensPorPagina = String(response.data.limit);
        })
        .catch(() => {
          this.mostrarToast("Falha ao recuperar dados", "error");
          this.fecharModal();
        });
    },
    abrirModal() {
      setTimeout(() => {
        document.getElementById("nome").focus();
      }, 1);
      this.tituloModal = "Cadastrar categoria";
      this.modal = true;
      this.novoItem = true;
    },
    checarProduto(idCategoria) {
      this.$axios
        .get(`produto/categoria/${idCategoria}`)
        .then(response => {
          if (response.data.length !== 0) {
            this.categoriaTemProdutos = true;
          } else {
            this.categoriaTemProdutos = false;
          }
        })
        .catch(() => {
          this.mostrarToast("Falha ao recuperar vendas do cliente", "error");
        });
    },
    abrirItem(item) {
      this.checarProduto(item._id);
      this.tituloModal = "Editar categoria";
      this.itemAtual.nome = item.nome;
      this.itemAtual.id = item._id;
      this.modal = true;
    },
    fecharModal() {
      this.modal = false;
      this.novoItem = false;
      setTimeout(() => {
        this.itemAtual.nome = "";
        this.categoriaTemProdutos = true;
        this.itemAtual.id = "";
      }, 1000);
    },
    salvarItem() {
      if (this.novoItem) {
        if (this.itemAtual.nome.length > 1) {
          delete this.itemAtual.id;

          this.$axios
            .post(`categoria`, { ...this.itemAtual })
            .then(() => {
              this.mostrarToast("Categoria de produto criada com sucesso");
              this.fecharModal();
              this.listarItens();
            })
            .catch(() => {
              this.mostrarToast("Falha ao criar categoria de produto", "error");
              this.fecharModal();
            });
        }
      } else {
        this.$axios
          .put(`categoria/${this.itemAtual.id}`, { ...this.itemAtual })
          .then(() => {
            this.mostrarToast("Categoria de produto editada com sucesso");
            this.fecharModal();
            this.listarItens();
          })
          .catch(() => {
            this.mostrarToast("Falha ao editar categoria de produto", "error");
            this.fecharModal();
          });
      }
    },
    deletarItem(item) {
      if (confirm(`Deseja realmente deletar a categoria ${item.nome}?`)) {
        this.$axios
          .delete(`categoria/${item.id}`)
          .then(() => {
            this.mostrarToast("Categoria de produto deletada com sucesso");
            this.fecharModal();
            this.listarItens();
          })
          .catch(() => {
            this.mostrarToast("Falha ao deletar categoria de produto", "error");
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
