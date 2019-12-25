<template>
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
                <v-text-field label="Nome" v-model="clienteAtual.nome"></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="6">
                <v-text-field label="CPF" v-model="clienteAtual.cpf" v-mask="['###.###.###-##']"></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="6">
                <v-text-field label="Endereço" v-model="clienteAtual.endereco"></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="6">
                <v-text-field label="Telefone" v-model="clienteAtual.telefone" v-mask="['(##) ####-####', '(##) #####-####']"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="fecharModal()">Fechar</v-btn>
          <v-btn color="primary" text @click="salvarCliente()">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-card>
      <v-card-title>
        <v-layout row wrap>
          <v-flex xs12 sm6 class="d-flex align-center pl-4">
            <h1 class="headline">Lista de clientes</h1>
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
          <v-icon small color="info" @click="abrirLivro(item)">
            mdi-pencil
          </v-icon>
          <v-icon small color="error" class="ml-1" @click="deletarCliente(item)">
            mdi-close
          </v-icon>
        </template>
      </v-data-table>
    </v-card>
    <Toast :ativo="toastAtivo" :mensagem="toastMensagem" :cor="toastCor" :tempo="toastTempo"></Toast>
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
      clienteAtual: {
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
    this.getClientes();
  },
  methods: {
    getClientes() {
      Vue.axios
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
      this.novo = true;
    },
    abrirLivro(item) {
      this.tituloModal = "Editar cliente";
      this.clienteAtual.nome = item.nome;
      this.clienteAtual.cpf = item.cpf;
      this.clienteAtual.endereco = item.endereco;
      this.clienteAtual.telefone = item.telefone;
      this.clienteAtual.id = item._id;
      this.modal = true;
    },
    fecharModal() {
      this.modal = false;
      this.novo = false;
      setTimeout(() => {
        this.clienteAtual.nome = "";
        this.clienteAtual.cpf = "";
        this.clienteAtual.endereco = "";
        this.clienteAtual.telefone = "";
        this.clienteAtual.id = "";
      }, 1000);
    },
    salvarCliente() {
      if (this.novo) {
        delete this.clienteAtual.id;
        Vue.axios
          .post(`cliente`, { ...this.clienteAtual })
          .then(() => {
            this.mostrarToast("Cliente criado com sucesso");
            this.fecharModal();
            this.getClientes();
          })
          .catch(() => {
            this.mostrarToast("Falha ao criar cliente", "red");
            this.fecharModal();
          });
      } else {
        Vue.axios
          .put(`cliente/${this.clienteAtual.id}`, { ...this.clienteAtual })
          .then(() => {
            this.mostrarToast("Cliente editado com sucesso");
            this.fecharModal();
            this.getClientes();
          })
          .catch(() => {
            this.mostrarToast("Falha ao editar cliente", "red");
            this.fecharModal();
          });
      }
    },
    deletarCliente(item) {
      Vue.axios
        .delete(`cliente/${item._id}`)
        .then(() => {
          this.mostrarToast("Cliente deletado com sucesso");
          this.fecharModal();
          this.getClientes();
        })
        .catch(() => {
          this.mostrarToast("Falha ao deletar cliente", "red");
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
