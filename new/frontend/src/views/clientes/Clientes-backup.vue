<template>
  <div>
    <Navbar></Navbar>
    <v-dialog v-model="modal" persistent>
      <v-card>
        <v-card-title>
          <span class="headline">{{tituloModal}}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="12" md="6">
                <v-text-field label="Nome" v-model="itemAtual.nome" @keyup.enter="salvarItem()" autocomplete="off"></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="6">
                <v-text-field label="CPF" v-model="itemAtual.cpf" @keyup.enter="salvarItem()" v-mask="['###.###.###-##']" autocomplete="off"></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="6">
                <v-text-field label="Endereço" v-model="itemAtual.endereco" @keyup.enter="salvarItem()" autocomplete="off"></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="6">
                <v-text-field label="Telefone" v-model="itemAtual.telefone" @keyup.enter="salvarItem()" v-mask="['(##) ####-####', '(##) #####-####']" autocomplete="off"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="fecharModal()">Fechar</v-btn>
          <v-btn color="primary" text @click="salvarItem()">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-card>
      <v-card-title>
        <v-layout row wrap>
          <v-flex xs12 sm6 class="d-flex align-center pl-4">
            <h1 class="headline">Clientes</h1>
            <v-btn small elevation="1" color="primary" class="ml-2" @click="abrirModal()">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-flex>
          <v-flex xs12 sm6>
            <v-text-field v-model="pesquisar" append-icon="mdi-magnify" label="Pesquisar" single-line hide-details></v-text-field>
          </v-flex>
        </v-layout>
      </v-card-title>
      <v-data-table :headers="cabecalhos" :items="clientes" sort-by="nome" :search="pesquisar">
        <template v-slot:item.action="{ item }">
          <v-icon small color="info" @click="abrirItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon small color="error" class="ml-1" @click="deletarItem(item)">
            mdi-close
          </v-icon>
        </template>
      </v-data-table>
    </v-card>
    <Toast :ativo="toastAtivo" :mensagem="toastMensagem" :cor="toastCor" :tempo="toastTempo"></Toast>
  </div>
</template>
<script>
// import Vue from "vue";
import Toast from "@/components/layout/Toast";
import { mask } from "vue-the-mask";
import Navbar from "@/components/layout/Navbar";

export default {
  name: "Clientes",
  directives: {
    mask
  },
  components: {
    Toast,
    Navbar
  },
  data() {
    return {
      tituloModal: "",
      toastAtivo: false,
      toastMensagem: "PatyApp",
      toastCor: "green",
      toastTempo: 3000,
      modal: false,
      pesquisar: "",
      novoItem: false,
      itemAtual: {
        nome: "",
        cpf: "",
        endereco: "",
        telefone: "",
        id: ""
      },
      clientes: [],
      cabecalhos: [
        { text: "Nome", align: "left", value: "nome" },
        { text: "CPF", value: "cpf" },
        { text: "Endereço", value: "endereco" },
        { text: "Telefone", value: "telefone" },
        { text: "Ação", value: "action", align: "right", sortable: false }
      ]
    };
  },
  created() {
    this.listarItens();
  },
  methods: {
    listarItens() {
      this.$axios
        .get("cliente")
        .then(response => {
          this.clientes = response.data;
        })
        .catch(() => {
          this.mostrarToast("Falha ao recuperar dados", "red");
          this.fecharModal();
        });
    },
    abrirModal() {
      this.tituloModal = "Cadastrar cliente";
      this.modal = true;
      this.novoItem = true;
    },
    abrirItem(item) {
      this.tituloModal = "Editar cliente";
      this.itemAtual.nome = item.nome;
      this.itemAtual.cpf = item.cpf;
      this.itemAtual.endereco = item.endereco;
      this.itemAtual.telefone = item.telefone;
      this.itemAtual.id = item._id;
      this.modal = true;
    },
    fecharModal() {
      this.modal = false;
      this.novoItem = false;
      setTimeout(() => {
        this.itemAtual.nome = "";
        this.itemAtual.cpf = "";
        this.itemAtual.endereco = "";
        this.itemAtual.telefone = "";
        this.itemAtual.id = "";
      }, 1000);
    },
    salvarItem() {
      if (this.novoItem) {
        delete this.itemAtual.id;

        if (this.itemAtual.cpf.length === 0) {
          delete this.itemAtual.cpf;
        }

        if (this.itemAtual.telefone.length === 0) {
          delete this.itemAtual.telefone;
        }

        if (this.itemAtual.endereco.length === 0) {
          delete this.itemAtual.endereco;
        }

        this.$axios
          .post(`cliente`, { ...this.itemAtual })
          .then(() => {
            this.mostrarToast("Cliente criado com sucesso");
            this.fecharModal();
            this.listarItens();
          })
          .catch(err => {
            if (err.response.data.isJoi) {
              console.log(err.response.data.details[0].type);
              if (err.response.data.details[0].type === "any.empty") {
                this.mostrarToast("O nome do cliente é obrigatório", "red");
              }
              if (err.response.data.details[0].type === "string.min") {
                this.mostrarToast(
                  "O nome do cliente deve possuir 2 ou mais caracteres",
                  "red"
                );
              }
            } else {
              this.mostrarToast("Falha ao criar cliente", "red");
            }
            this.fecharModal();
          });
      } else {
        this.$axios
          .put(`cliente/${this.itemAtual.id}`, { ...this.itemAtual })
          .then(() => {
            this.mostrarToast("Cliente editado com sucesso");
            this.fecharModal();
            this.listarItens();
          })
          .catch(() => {
            this.mostrarToast("Falha ao editar cliente", "red");
            this.fecharModal();
          });
      }
    },
    deletarItem(item) {
      if (confirm(`Deseja realmente deletar o cliente ${item.nome}?`)) {
        this.$axios
          .delete(`cliente/${item._id}`)
          .then(() => {
            this.mostrarToast("Cliente deletado com sucesso");
            this.fecharModal();
            this.listarItens();
          })
          .catch(() => {
            this.mostrarToast("Falha ao deletar cliente", "red");
            this.fecharModal();
          });
      }
    },
    mostrarToast(msg, cor = "green") {
      this.toastAtivo = true;
      this.toastMensagem = msg;
      this.toastCor = cor;
      setInterval(() => {
        this.toastAtivo = false;
      }, this.toastTempo + 100);
    }
  }
};
</script>
