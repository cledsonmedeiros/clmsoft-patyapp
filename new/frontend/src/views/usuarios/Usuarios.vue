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
              <v-col cols="12" sm="12" md="12">
                <v-text-field label="Nome" id="nome" :readonly="itemAtual.usuario === 'admin'" v-model="itemAtual.nome" @keyup.enter="salvarItem()" autocomplete="off"></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="6">
                <v-text-field label="Usuário" :readonly="itemAtual.usuario === 'admin'" v-model="itemAtual.usuario" @keyup.enter="salvarItem()" autocomplete="off"></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="6">
                <v-text-field label="Senha" v-model="itemAtual.senha" @click:append="mostrarSenha = !mostrarSenha" :type="mostrarSenha ? 'text' : 'password'" :append-icon="mostrarSenha ? 'mdi-eye' : 'mdi-eye-off'" @keyup.enter="salvarItem()" autocomplete="off"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" text :disabled="usuarioTemVendas || itemAtual.usuario === 'admin'" v-if="!novoItem" @click="deletarItem(itemAtual)">{{usuarioTemVendas ? 'Não pode deletar' : 'Deletar'}}</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="fecharModal()">Fechar</v-btn>
          <v-btn color="primary" text @click="salvarItem()" :disabled="itemAtual.nome.trim().length < 2">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-card>
      <v-card-title>
        <v-layout row wrap>
          <v-flex xs12 sm6 class="d-flex align-center pl-4">
            <h1 class="headline">Usuários</h1>
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
        <v-data-table :headers="cabecalhos" :items="usuarios" :search="pesquisar" :page.sync="paginaAtual" :items-per-page="Number(itensPorPagina)" hide-default-footer :page-count="numeroPaginas">
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
  name: "Usuarios",
  directives: {
    mask
  },
  components: {},
  data() {
    return {
      mostrarSenha: false,
      usuarioTemVendas: true,
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
        usuario: "",
        senha: "",
        id: ""
      },
      usuarios: [],
      cabecalhos: [
        { text: "Nome", align: "left", value: "nome" },
        { text: "Usuário", value: "usuario" },
        // { text: "Senha", value: "senha" },
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
          `usuario?page=${n ? 1 : this.paginaAtual}&limit=${
            this.itensPorPagina
          }`
        )
        .then(response => {
          this.usuarios = response.data.docs;
          this.paginaAtual = n ? 1 : response.data.page;
          this.numeroPaginas = response.data.totalPages;
          this.itensPorPagina = String(response.data.limit);
        })
        .catch(() => {
          this.mostrarToast("Falha ao listar usuarios", "error");
          this.fecharModal();
        });
    },
    abrirModal() {
      setTimeout(() => {
        document.getElementById("nome").focus();
      }, 1);
      this.tituloModal = "Cadastrar usuario";
      this.modal = true;
      this.novoItem = true;
    },
    checarVenda(idUsuario) {
      this.$axios
        .get(`venda/usuario/${idUsuario}`)
        .then(response => {
          if (response.data.length !== 0) {
            this.usuarioTemVendas = true;
          } else {
            this.usuarioTemVendas = false;
          }
        })
        .catch(() => {
          this.mostrarToast("Falha ao listar vendas do usuario", "error");
        });
    },
    abrirItem(item) {
      this.checarVenda(item._id);
      this.tituloModal = "Editar usuario";
      this.itemAtual.nome = item.nome;
      this.itemAtual.usuario = item.usuario;
      this.itemAtual.senha = item.senha;
      this.itemAtual.id = item._id;
      this.modal = true;
    },
    fecharModal() {
      this.modal = false;
      this.novoItem = false;
      setTimeout(() => {
        this.usuarioTemVendas = false;
        this.itemAtual.nome = "";
        this.itemAtual.usuario = "";
        this.itemAtual.senha = "";
        this.itemAtual.id = "";
      }, 1000);
    },
    salvarItem() {
      if (this.novoItem) {
        if (this.itemAtual.nome.length > 0) {
          delete this.itemAtual.id;

          this.$axios
            .post(`usuario`, { ...this.itemAtual })
            .then(() => {
              this.mostrarToast("Usuário criado com sucesso");
              this.fecharModal();
              this.listarItens();
            })
            .catch(err => {
              this.mostrarToast("Falha ao criar usuario", "error");
              this.fecharModal();
            });
        }
      } else {
        this.$axios
          .put(`usuario/${this.itemAtual.id}`, { ...this.itemAtual })
          .then(() => {
            this.mostrarToast("Usuário editado com sucesso");
            this.fecharModal();
            this.listarItens();
          })
          .catch(() => {
            this.mostrarToast("Falha ao editar usuario", "error");
            this.fecharModal();
          });
      }
    },
    deletarItem(item) {
      if (confirm(`Deseja realmente deletar o usuario ${item.nome}?`)) {
        this.$axios
          .delete(`usuario/${item.id}`)
          .then(() => {
            this.mostrarToast("Usuário deletado com sucesso");
            this.fecharModal();
            this.listarItens();
          })
          .catch(() => {
            this.mostrarToast("Falha ao deletar usuario", "error");
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
