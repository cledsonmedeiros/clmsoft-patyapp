<template>
  <v-data-table :headers="headers" :items="vendas" :search="search" sort-by="name" class="elevation-1">
    <template v-slot:item.isPrazo="{ item }">
      <v-icon :color="getColor(item.isPrazo)">
        {{ item.isPrazo ? "mdi-credit-card-clock-outline" : "mdi-currency-usd" }}
      </v-icon>
    </template>
    <template v-slot:item.total="{ item }">
      {{ item.total.toFixed(2) }}
    </template>
    <!-- <template v-slot:item.date_complete="{ item }">
        {{ item.date_complete | moment().format("DD/MM/YYYY") }}
    </template> -->
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
        <v-text-field color="purple" v-model="search" append-icon="mdi-magnify" label="Pesquisar" single-line hint="Clientes" persistent-hint></v-text-field>
        <v-dialog v-model="dialog" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="12" md="12">
                    <v-text-field color="purple" v-model="editedItem.name" :rules="nameRules" label="Nome"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="12" md="12">
                    <v-text-field color="purple" v-model="editedItem.address" label="Endereço"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field color="purple" v-model="editedItem.contact" v-mask="mascaraTelefone" label="Contato"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field color="purple" v-model="editedItem.cpf" v-mask="mascaraCPF" class="cpf" label="CPF"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <div class="flex-grow-1"></div>
              <v-btn color="purple" text @click="close">Cancelar</v-btn>
              <v-btn color="purple" text :disabled="editedItem.name === undefined || editedItem.name.length === 0" @click="save">Salvar</v-btn>
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
      { text: "Data", value: "date_complete" },
      { text: "Cliente", align: "start", value: "customer.name" },
      { text: "Pagamento", align: "end", value: "isPrazo" },
      { text: "Valor", align: "end", value: "total" }
      // { text: "Ações", value: "action", sortable: false, align: "end" }
    ],
    vendas: [],
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
    },
    api_url:
      process.env.VUE_APP_ENV === "dev"
        ? process.env.VUE_APP_API_URL_LOCAL
        : process.env.VUE_APP_API_URL
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
    getColor(bool) {
      if (bool) return "warning";
      else return "green";
    },
    atualizarLista() {
      axios.get(`${this.api_url}/sell`).then(response => {
        this.vendas = response.data;
      });
    },
    editItem(item) {
      this.editedIndex = this.vendas.indexOf(item);

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
      const index = this.vendas.indexOf(item);

      if (confirm("Deseja realmente deletar esse item?")) {
        let id = this.vendas[this.vendas.indexOf(item)]._id;
        axios.delete(`${this.api_url}/sell/delete/${id}`).then(response => {
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
          _id: this.vendas[this.editedIndex]._id,
          name: this.vendas[this.editedIndex].name,
          contact: this.vendas[this.editedIndex].contact,
          address: this.vendas[this.editedIndex].address,
          cpf: this.vendas[this.editedIndex].cpf
        };

        let newCliente = {
          _id: this.editedItem._id,
          name: this.editedItem.name,
          contact: this.editedItem.contact,
          address: this.editedItem.address,
          cpf: this.editedItem.cpf
        };
        axios
          .put(`${this.api_url}/sell/update/${newCliente._id}`, newCliente)
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
        axios
          .post(`${this.api_url}/sell`, {
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
