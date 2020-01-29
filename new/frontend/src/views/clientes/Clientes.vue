<template>
  <div>
    <v-dialog v-model="modal" persistent>
      <v-card>
        <v-card-title>
          <span class="headline">{{tituloModal}}</span>
        </v-card-title>
        <v-card-text>
          <v-container fluid>
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
          <v-btn color="primary" text :disabled="clienteTemVendas" v-if="!novoItem" @click="deletarItem(itemAtual)">{{clienteTemVendas ? 'Não pode deletar' : 'Deletar'}}</v-btn>
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
      <div>
        <v-data-table :headers="cabecalhos" :items="clientes" :search="pesquisar" :page.sync="paginaAtual" :items-per-page="Number(itensPorPagina)" hide-default-footer :page-count="numeroPaginas">
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
import { mask } from "vue-the-mask";

export default {
  name: "Clientes",
  directives: {
    mask
  },
  components: {},
  data() {
    return {
      clienteTemVendas: true,
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
    listarItens(n = false) {
      this.$axios
        .get(
          `cliente?page=${n ? 1 : this.paginaAtual}&limit=${
            this.itensPorPagina
          }`
        )
        .then(response => {
          this.clientes = response.data.docs;
          this.paginaAtual = n ? 1 : response.data.page;
          this.numeroPaginas = response.data.totalPages;
          this.itensPorPagina = String(response.data.limit);
        })
        .catch(() => {
          this.mostrarToast("Falha ao recuperar clientes", "error");
          this.fecharModal();
        });
    },
    abrirModal() {
      this.tituloModal = "Cadastrar cliente";
      this.modal = true;
      this.novoItem = true;
    },
    checarVenda(idCliente) {
      this.$axios
        .get(`venda/cliente/${idCliente}`)
        .then(response => {
          if (response.data.length !== 0) {
            this.clienteTemVendas = true;
          } else {
            this.clienteTemVendas = false;
          }
        })
        .catch(() => {
          this.mostrarToast("Falha ao recuperar vendas do cliente", "error");
        });
    },
    abrirItem(item) {
      this.checarVenda(item._id);
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
        this.clienteTemVendas = false;
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
              if (err.response.data.details[0].type === "any.empty") {
                this.mostrarToast("O nome do cliente é obrigatório", "error");
              }
              if (err.response.data.details[0].type === "string.min") {
                this.mostrarToast(
                  "O nome do cliente deve possuir 2 ou mais caracteres",
                  "error"
                );
              }
            } else {
              this.mostrarToast("Falha ao criar cliente", "error");
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
            this.mostrarToast("Falha ao editar cliente", "error");
            this.fecharModal();
          });
      }
    },
    deletarItem(item) {
      if (confirm(`Deseja realmente deletar o cliente ${item.nome}?`)) {
        this.$axios
          .delete(`cliente/${item.id}`)
          .then(() => {
            this.mostrarToast("Cliente deletado com sucesso");
            this.fecharModal();
            this.listarItens();
          })
          .catch(() => {
            this.mostrarToast("Falha ao deletar cliente", "error");
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
