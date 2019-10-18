<template>
  <v-data-table
    :headers="headers"
    :items="clientes"
    :search="search"
    sort-by="name"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title class="mr-5">
          <div>
            <v-btn text icon color="purple" @click="open">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
            <v-btn text icon class="mr-10" color="purple" @click="atualizarLista()">
              <v-icon>mdi-cached</v-icon>
            </v-btn>
          </div>
        </v-toolbar-title>
        <div class="flex-grow-1"></div>
        <v-text-field
          color="purple"
          v-model="search"
          append-icon="mdi-magnify"
          label="Pesquisar"
          single-line
          hint="Clientes"
          persistent-hint
        ></v-text-field>
        <v-dialog v-model="dialog" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="12" md="12">
                    <v-text-field
                      color="purple"
                      v-model="editedItem.name"
                      :rules="nameRules"
                      label="Nome"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="12" md="12">
                    <v-text-field color="purple" v-model="editedItem.address" label="Endereço"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      color="purple"
                      v-model="editedItem.contact"
                      v-mask="mascaraTelefone"
                      label="Contato"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      color="purple"
                      v-model="editedItem.cpf"
                      v-mask="mascaraCPF"
                      class="cpf"
                      label="CPF"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <div class="flex-grow-1"></div>
              <v-btn color="purple" text @click="close">Cancelar</v-btn>
              <v-btn
                color="purple"
                text
                :disabled="editedItem.name === undefined || editedItem.name.length === 0"
                @click="save"
              >Salvar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.action="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
      <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
    </template>
  </v-data-table>
</template>

<script>
import axios from "axios";
import { mask } from "vue-the-mask";

export default {
  name: "ClienteGerenciar",
  directives: {
    mask
  },
  data: () => ({
    mascaraTelefone: "(##) #.####-####",
    mascaraCPF: "###.###.###-##",
    dialog: false,
    valid: false,
    nameRules: [v => !!v || "O nome é obrigatório"],
    search: "",
    headers: [
      { text: "Nome", value: "name" },
      { text: "Contato", value: "contact" },
      { text: "Endereço", value: "address" },
      { text: "CPF", value: "cpf" },
      { text: "Ações", value: "action", sortable: false, align: "right" }
    ],
    clientes: [],
    editedIndex: -1,
    editedItem: {
      cliente: {
        name: "",
        contact: "",
        address: "",
        cpf: ""
      }
    },
    defaultItem: {
      cliente: {
        name: "",
        contact: "",
        address: "",
        cpf: ""
      }
    }
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Criar" : "Editar";
    }
  },
  watch: {
    dialog(val) {
      val || this.close();
    }
  },
  created() {
    this.atualizarLista();
  },
  methods: {
    atualizarLista() {
      let api_url =
        process.env.VUE_APP_ENV === "dev"
          ? process.env.VUE_APP_API_URL_LOCAL
          : process.env.VUE_APP_API_URL;

      axios.get(`${api_url}/customers`).then(response => {
        this.clientes = response.data;
      });
    },
    editItem(item) {
      this.editedIndex = this.clientes.indexOf(item);

      let cliente = {
        _id: item._id,
        name: item.name,
        contact: item.contact,
        address: item.address,
        cpf: item.cpf
      };

      this.editedItem = Object.assign({}, cliente);
      this.dialog = true;
    },
    deleteItem(item) {
      const index = this.clientes.indexOf(item);

      if (confirm("Deseja realmente deletar esse item?")) {
        let id = this.clientes[this.clientes.indexOf(item)]._id;
        let api_url =
          process.env.VUE_APP_ENV === "dev"
            ? process.env.VUE_APP_API_URL_LOCAL
            : process.env.VUE_APP_API_URL;

        axios.delete(`${api_url}/customers/delete/${id}`).then(response => {
          this.atualizarLista();
          this.$toast.open({
            message: "Cliente deletado com sucesso",
            type: "success",
            position: "bottom",
            duration: 2000
          });
        });
      }
    },
    open() {
      this.dialog = true;
    },
    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
    save() {
      if (this.editedIndex > -1) {
        let oldCliente = {
          _id: this.clientes[this.editedIndex]._id,
          name: this.clientes[this.editedIndex].name,
          contact: this.clientes[this.editedIndex].contact,
          address: this.clientes[this.editedIndex].address,
          cpf: this.clientes[this.editedIndex].cpf
        };

        let newCliente = {
          _id: this.editedItem._id,
          name: this.editedItem.name,
          contact: this.editedItem.contact,
          address: this.editedItem.address,
          cpf: this.editedItem.cpf
        };

        let api_url =
          process.env.VUE_APP_ENV === "dev"
            ? process.env.VUE_APP_API_URL_LOCAL
            : process.env.VUE_APP_API_URL;

        axios
          .put(`${api_url}/customers/update/${newCliente._id}`, newCliente)
          .then(response => {
            this.atualizarLista();
            this.$toast.open({
              message: "Cliente atualizado com sucesso",
              type: "success",
              position: "bottom",
              duration: 2000
            });
          });
      } else {
        let newCliente = {
          name: this.editedItem.name,
          contact: this.editedItem.contact,
          address: this.editedItem.address,
          cpf: this.editedItem.cpf
        };

        let api_url =
          process.env.VUE_APP_ENV === "dev"
            ? process.env.VUE_APP_API_URL_LOCAL
            : process.env.VUE_APP_API_URL;

        axios
          .post(`${api_url}/customers`, {
            customer: {
              name: newCliente.name,
              contact: newCliente.contact,
              address: newCliente.address,
              cpf: newCliente.cpf
            }
          })
          .then(response => {
            this.atualizarLista();
            this.$toast.open({
              message: "Cliente criado com sucesso",
              type: "success",
              position: "bottom",
              duration: 2000
            });
          })
          .catch(response => {
            this.$toast.open({
              message: "Falha ao criar cliente",
              type: "error",
              position: "bottom",
              duration: 2000
            });
          });
      }
      this.close();
    }
  }
};
</script>
