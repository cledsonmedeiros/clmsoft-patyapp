<template>
  <v-data-table
    :headers="headers"
    :search="search"
    :items="donosprodutos"
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
          hint="Donos de produto"
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
      <v-icon small class="mr-4" @click="editItem(item)">mdi-pencil</v-icon>
      <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
    </template>
  </v-data-table>
</template>

<script>
import axios from "axios";

export default {
  name: "ProdutoDonoGerenciar",
  data: () => ({
    dialog: false,
    valid: false,
    nameRules: [v => !!v || "O nome é obrigatório"],
    search: "",
    headers: [
      { text: "Nome", value: "name" },
      { text: "Ações", value: "action", sortable: false, align: "right" }
    ],
    donosprodutos: [],
    editedIndex: -1,
    editedItem: {
      donoproduto: {
        name: ""
      }
    },
    defaultItem: {
      donoproduto: {
        name: ""
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

      axios.get(`${api_url}/productowner`).then(response => {
        this.donosprodutos = response.data;
      });
    },
    editItem(item) {
      this.editedIndex = this.donosprodutos.indexOf(item);

      let donoproduto = {
        _id: item._id,
        name: item.name
      };

      this.editedItem = Object.assign({}, donoproduto);
      this.dialog = true;
    },
    deleteItem(item) {
      const index = this.donosprodutos.indexOf(item);

      if (confirm("Deseja realmente deletar esse item?")) {
        let id = this.donosprodutos[this.donosprodutos.indexOf(item)]._id;
        let api_url =
          process.env.VUE_APP_ENV === "dev"
            ? process.env.VUE_APP_API_URL_LOCAL
            : process.env.VUE_APP_API_URL;

        axios.delete(`${api_url}/productowner/delete/${id}`).then(response => {
          this.atualizarLista();
          this.$toast.open({
            message: "Dono de produto deletado com sucesso",
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
          _id: this.donosprodutos[this.editedIndex]._id,
          name: this.donosprodutos[this.editedIndex].name
        };

        let newDonoProduto = {
          _id: this.editedItem._id,
          name: this.editedItem.name
        };

        let api_url =
          process.env.VUE_APP_ENV === "dev"
            ? process.env.VUE_APP_API_URL_LOCAL
            : process.env.VUE_APP_API_URL;

        axios
          .put(
            `${api_url}/productowner/update/${newDonoProduto._id}`,
            newDonoProduto
          )
          .then(response => {
            this.atualizarLista();
            this.$toast.open({
              message: "Dono de produto atualizado com sucesso",
              type: "success",
              position: "bottom",
              duration: 2000
            });
          });
      } else {
        let newDonoProduto = {
          name: this.editedItem.name
        };

        let api_url =
          process.env.VUE_APP_ENV === "dev"
            ? process.env.VUE_APP_API_URL_LOCAL
            : process.env.VUE_APP_API_URL;

        axios
          .post(`${api_url}/productowner`, {
            productowner: {
              name: newDonoProduto.name
            }
          })
          .then(response => {
            this.atualizarLista();
            this.$toast.open({
              message: "Dono de produto criado com sucesso",
              type: "success",
              position: "bottom",
              duration: 2000
            });
          })
          .catch(response => {
            this.$toast.open({
              message: "Falha ao criar dono de produto",
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
