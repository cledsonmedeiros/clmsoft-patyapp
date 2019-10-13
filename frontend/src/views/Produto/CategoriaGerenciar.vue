<template>
  <v-data-table :headers="headers" :items="categoriasprodutos" sort-by="name" class="elevation-1">
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>
          Gerenciar categorias de produto
          <v-btn text icon color="purple" @click="atualizarLista()">
            <v-icon>mdi-cached</v-icon>
          </v-btn>
          <v-btn text icon color="purple" to="/categoriasdeprodutos/pesquisar">
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
        </v-toolbar-title>
        <div class="flex-grow-1"></div>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn color="purple" outlined dark class="mb-2" v-on="on">
              <v-icon left>mdi-plus</v-icon>
              <span>Novo</span>
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="12" md="12">
                    <v-text-field v-model="editedItem.name" :rules="nameRules" label="Nome"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <div class="flex-grow-1"></div>
              <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
              <v-btn
                color="blue darken-1"
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

export default {
  name: "ProdutoCategoriaGerenciar",
  data: () => ({
    dialog: false,
    valid: false,
    nameRules: [
      v => !!v || "O nome é obrigatório"
    ],
    search: "",
    headers: [
      { text: "Nome", value: "name" },
      { text: "Ações", value: "action", sortable: false, align: 'right', }
    ],
    categoriasprodutos: [],
    editedIndex: -1,
    editedItem: {
      categoriaproduto: {
        name: "",
      }
    },
    defaultItem: {
      categoriaproduto: {
        name: "",
      }
    }
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nova categoria de produto" : "Editar categoria de produto";
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

      axios.get(`${api_url}/productcategory`).then(response => {
        this.categoriasprodutos = response.data;
      });
    },
    editItem(item) {
      this.editedIndex = this.categoriasprodutos.indexOf(item);

      let categoriaproduto = {
        _id: item._id,
        name: item.name,
      };

      this.editedItem = Object.assign({}, categoriaproduto);
      this.dialog = true;
    },
    deleteItem(item) {
      const index = this.categoriasprodutos.indexOf(item);

      if (confirm("Deseja realmente deletar esse item?")) {
        let id = this.categoriasprodutos[this.categoriasprodutos.indexOf(item)]._id;
        let api_url =
          process.env.VUE_APP_ENV === "dev"
            ? process.env.VUE_APP_API_URL_LOCAL
            : process.env.VUE_APP_API_URL;

        axios.delete(`${api_url}/productcategory/delete/${id}`).then(response => {
          this.atualizarLista();
          this.$toast.open({
            message: "Categoria de produto deletada com sucesso",
            type: "success",
            position: "bottom",
            duration: 2000
          });
        });
      }
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
        let oldCategoriaProduto = {
          _id: this.categoriasprodutos[this.editedIndex]._id,
          name: this.categoriasprodutos[this.editedIndex].name,
        };

        let newCategoriaProduto = {
          _id: this.editedItem._id,
          name: this.editedItem.name,
        };

        let api_url =
          process.env.VUE_APP_ENV === "dev"
            ? process.env.VUE_APP_API_URL_LOCAL
            : process.env.VUE_APP_API_URL;

        axios
          .put(`${api_url}/productcategory/update/${newCategoriaProduto._id}`, newCategoriaProduto)
          .then(response => {
            this.atualizarLista();
            this.$toast.open({
              message: "Categoria de produto atualizada com sucesso",
              type: "success",
              position: "bottom",
              duration: 2000
            });
          });
      } else {
        let newCategoriaProduto = {
          name: this.editedItem.name,
        };

        let api_url =
          process.env.VUE_APP_ENV === "dev"
            ? process.env.VUE_APP_API_URL_LOCAL
            : process.env.VUE_APP_API_URL;

        axios
          .post(`${api_url}/productcategory`, {
            productcategory: {
              name: newCategoriaProduto.name,
            }
          })
          .then(response => {
            this.atualizarLista();
            this.$toast.open({
              message: "Categoria de produto criada com sucesso",
              type: "success",
              position: "bottom",
              duration: 2000
            });
          })
          .catch(response => {
            this.$toast.open({
              message: "Falha ao criar categoria de produto",
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
