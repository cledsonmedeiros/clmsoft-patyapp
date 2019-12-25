<template>
  <div>
    <div>
      <v-dialog v-model="modal" persistent>
        <v-card>
          <v-card-title>
            <span class="headline">{{tituloModal}}</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="12" md="6">
                  <v-text-field label="Título" v-model="livroAtual.titulo"></v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="6">
                  <v-text-field label="Autor" v-model="livroAtual.autor"></v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="6">
                  <v-text-field label="Edição" v-model="livroAtual.edicao" v-mask="['###']"></v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="6">
                  <v-text-field label="ISBN" v-model="livroAtual.isbn" v-mask="['#############']"></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="fecharModal()">Fechar</v-btn>
            <v-btn color="primary" text @click="salvarLivro()">Salvar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-card>
        <v-card-title>
          <v-layout row wrap>
            <v-flex xs12 sm6 class="d-flex align-center pl-4">
              <h1 class="headline">Lista de livros</h1>
              <v-btn small elevation="1" color="primary" class="ml-2" @click="abrirModal()">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-flex>
            <v-flex xs12 sm6>
              <v-text-field v-model="pesquisar" append-icon="mdi-magnify" label="Pesquisar" single-line hide-details></v-text-field>
            </v-flex>
          </v-layout>
        </v-card-title>
        <v-data-table :headers="cabecalhos" :items="livros" sort-by="nome" :search="pesquisar">
          <template v-slot:item.action="{ item }">
            <v-icon small color="info" @click="abrirLivro(item)">
              mdi-pencil
            </v-icon>
            <v-icon small color="error" class="ml-1" @click="deletarLivro(item)">
              mdi-close
            </v-icon>
          </template>
        </v-data-table>
      </v-card>
      <Toast :ativo="toastAtivo" :mensagem="toastMensagem" :cor="toastCor" :tempo="toastTempo"></Toast>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import Toast from "@/components/layout/Toast";
import { mask } from "vue-the-mask";

export default {
  name: "Usuarios",
  directives: {
    mask
  },
  components: {
    Toast
  },
  data() {
    return {
      tituloModal: "",
      toastAtivo: false,
      toastMensagem: "Lielson",
      toastCor: "green",
      toastTempo: 2500,
      modal: false,
      pesquisar: "",
      novo: false,
      livroAtual: {
        titulo: "",
        autor: "",
        edicao: "",
        isbn: "",
        id: ""
      },
      livros: [],
      cabecalhos: [
        { text: "Título", align: "left", value: "titulo" },
        { text: "Autor", value: "autor" },
        { text: "Edição", value: "edicao" },
        { text: "ISBN", value: "isbn" },
        { text: "Ação", value: "action", align: "right", sortable: false }
      ]
    };
  },
  created() {
    this.getUsuarios();
  },
  methods: {
    getUsuarios() {
      Vue.axios
        .get("usuario")
        .then(response => {
          this.livros = response.data;
        })
        .catch(() => {
          this.mostrarToast("Falha ao recuperar dados", "red");
          this.fecharModal();
        });
    },
    abrirModal() {
      this.tituloModal = "Cadastrar livro";
      this.modal = true;
      this.novo = true;
    },
    abrirLivro(item) {
      this.tituloModal = "Editar livro";
      this.livroAtual.titulo = item.titulo;
      this.livroAtual.autor = item.autor;
      this.livroAtual.edicao = Number(item.edicao);
      this.livroAtual.isbn = item.isbn;
      this.livroAtual.id = item.id;
      this.modal = true;
    },
    fecharModal() {
      this.modal = false;
      this.novo = false;
      setTimeout(() => {
        this.livroAtual.titulo = "";
        this.livroAtual.autor = "";
        this.livroAtual.edicao = "";
        this.livroAtual.isbn = "";
        this.livroAtual.id = "";
      }, 1000);
    },
    salvarLivro() {
      this.livroAtual.edicao = Number(this.livroAtual.edicao);
      if (this.novo) {
        delete this.livroAtual.id;
        Vue.axios
          .post(`livro`, { ...this.livroAtual })
          .then(response => {
            this.mostrarToast("Livro criado com sucesso");
            this.fecharModal();
            this.getUsuarios();
          })
          .catch(() => {
            this.mostrarToast("Falha ao criar livro", "red");
            this.fecharModal();
          });
      } else {
        Vue.axios
          .put(`livro/${this.livroAtual.id}`, { ...this.livroAtual })
          .then(response => {
            this.mostrarToast("Livro editado com sucesso");
            this.fecharModal();
            this.getUsuarios();
          })
          .catch(() => {
            this.mostrarToast("Falha ao editar livro", "red");
            this.fecharModal();
          });
      }
    },
    deletarLivro(item) {
      Vue.axios
        .delete(`livro/${item.id}`)
        .then(response => {
          this.mostrarToast("Livro deletado com sucesso");
          this.fecharModal();
          this.getUsuarios();
        })
        .catch(() => {
          this.mostrarToast("Falha ao deletar livro", "red");
          this.fecharModal();
        });
    },
    mostrarToast(msg, cor = "green") {
      this.toastAtivo = true;
      this.toastMensagem = msg;
      this.toastCor = cor;
      setInterval(() => {
        this.toastAtivo = false;
      }, this.toastTempo);
    }
  }
};
</script>
