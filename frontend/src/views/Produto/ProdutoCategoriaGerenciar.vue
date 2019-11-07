<template>
  <div>
    <v-data-table :headers="headers" :items="categoriasprodutos" :search="search" sort-by="name" class="elevation-1" v-show="!this.overlay">
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
          <v-text-field color="purple" v-model="search" append-icon="mdi-magnify" label="Pesquisar" single-line hint="Categorias de produto" persistent-hint></v-text-field>
          <v-dialog v-model="dialog" max-width="500px">
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field color="purple" v-model="editedItem.name" :rules="nameRules" label="Nome" @keyup.enter="save"></v-text-field>
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
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script>
import axios from "axios";

export default {
  overlay: false,
  name: "ProdutoCategoriaGerenciar",
  data: () => ({
    dialog: false,
    valid: false,
    nameRules: [v => !!v || "O nome é obrigatório"],
    search: "",
    headers: [
      { text: "Nome", value: "name" },
      { text: "Ações", value: "action", sortable: false, align: "right" }
    ],
    categoriasprodutos: [],
    editedIndex: -1,
    editedItem: {
      categoriaproduto: {
        name: ""
      }
    },
    defaultItem: {
      categoriaproduto: {
        name: ""
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
    changeOverlay() {
      this.overlay = !this.overlay;
    },
    atualizarLista() {
      this.changeOverlay();
      axios.get(`${this.api_url}/productcategory`).then(response => {
        this.categoriasprodutos = response.data;
        this.changeOverlay();
      });
    },
    editItem(item) {
      this.editedIndex = this.categoriasprodutos.indexOf(item);

      let categoriaproduto = {
        _id: item._id,
        name: item.name
      };

      this.editedItem = Object.assign({}, categoriaproduto);
      this.dialog = true;
    },
    deleteItem(item) {
      const index = this.categoriasprodutos.indexOf(item);

      if (confirm("Deseja realmente deletar esse item?")) {
        let id = this.categoriasprodutos[this.categoriasprodutos.indexOf(item)]
          ._id;
        axios
          .delete(`${this.api_url}/productcategory/delete/${id}`)
          .then(response => {
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
        let oldCategoriaProduto = {
          _id: this.categoriasprodutos[this.editedIndex]._id,
          name: this.categoriasprodutos[this.editedIndex].name
        };

        let newCategoriaProduto = {
          _id: this.editedItem._id,
          name: this.editedItem.name
        };
        axios
          .put(
            `${this.api_url}/productcategory/update/${newCategoriaProduto._id}`,
            newCategoriaProduto
          )
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
          name: this.editedItem.name
        };
        axios
          .post(`${this.api_url}/productcategory`, {
            productcategory: {
              name: newCategoriaProduto.name
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
