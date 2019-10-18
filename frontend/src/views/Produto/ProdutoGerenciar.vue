<template>
  <v-data-table
    :headers="headers"
    :search="search"
    :items="produtos"
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
          hint="Produto"
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
                  <v-col cols="12" sm="12" md="2">
                    <v-text-field
                      color="purple"
                      v-model="editedItem.amount"
                      type="number"
                      label="Qntd"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="12" md="5">
                    <v-text-field
                      color="purple"
                      v-model="editedItem.price_buy"
                      label="Preço de compra"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="12" md="5">
                    <v-text-field
                      color="purple"
                      v-model="editedItem.price_sell"
                      label="Preço de venda"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="12" md="6">
                    <v-select
                      v-model="selected_dono"
                      :items="select_dono"
                      item-text="name"
                      item-value="_id"
                      label="Dono"
                      return-object
                      single-line
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="12" md="6">
                    <v-select
                      v-model="selected_categoria"
                      :items="select_categoria"
                      item-text="name"
                      item-value="_id"
                      label="Categoria"
                      return-object
                      single-line
                    ></v-select>
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
    selected_dono: { name: "", _id: "" },
    select_dono: [],
    selected_categoria: { name: "", _id: "" },
    select_categoria: [],
    headers: [
      { text: "Nome", value: "name" },
      { text: "Quantidade", value: "amount" },
      { text: "Dono", value: "owner.name" },
      { text: "Categoria", value: "category.name" },
      { text: "Preço de compra", value: "price_buy" },
      { text: "Preço de venda", value: "price_sell" },
      { text: "Ações", value: "action", sortable: false, align: "right" }
    ],
    produtos: [],
    editedIndex: -1,
    editedItem: {
      name: "",
      amount: "",
      owner_name: "",
      owner_id: "",
      category_name: "",
      category_id: "",
      price_buy: "",
      price_sell: ""
    },
    defaultItem: {
      name: "",
      amount: "",
      owner_name: "",
      owner_id: "",
      category_name: "",
      category_id: "",
      price_buy: "",
      price_sell: ""
    }
  }),
  computed: {
    formTitle() {
      if (this.editedIndex === -1) {
        return "Criar";
      } else {
        return "Editar";
      }
    }
  },
  watch: {
    dialog(val) {
      val || this.close();
    }
  },
  created() {
    this.atualizarLista();
    this.atualizarListaDonos();
    this.atualizarListaCategorias();
  },
  methods: {
    atualizarLista() {
      let api_url =
        process.env.VUE_APP_ENV === "dev"
          ? process.env.VUE_APP_API_URL_LOCAL
          : process.env.VUE_APP_API_URL;

      axios.get(`${api_url}/products`).then(response => {
        this.produtos = response.data;
      });
    },
    atualizarListaDonos() {
      let api_url =
        process.env.VUE_APP_ENV === "dev"
          ? process.env.VUE_APP_API_URL_LOCAL
          : process.env.VUE_APP_API_URL;

      axios.get(`${api_url}/productowner`).then(response => {
        this.select_dono = response.data;
      });
    },
    atualizarListaCategorias() {
      let api_url =
        process.env.VUE_APP_ENV === "dev"
          ? process.env.VUE_APP_API_URL_LOCAL
          : process.env.VUE_APP_API_URL;

      axios.get(`${api_url}/productcategory`).then(response => {
        this.select_categoria = response.data;
      });
    },
    limparForm() {
      this.editedItem.name = "";
      this.editedItem.amount = "";
      this.editedItem.price_buy = "";
      this.editedItem.price_sell = "";
      this.selected_dono._id = "";
      this.selected_dono.name = "";
      this.selected_categoria._id = "";
      this.selected_categoria.name = "";
      return true;
    },
    editItem(item) {
      this.editedIndex = this.produtos.indexOf(item);

      this.atualizarListaDonos();
      this.atualizarListaCategorias();

      let produto = {
        _id: item._id,
        name: item.name,
        amount: item.amount,
        owner_name: item.owner.name,
        owner_id: item.owner._id,
        category_name: item.category.name,
        category_id: item.category._id,
        price_buy: item.price_buy,
        price_sell: item.price_sell
      };

      this.selected_dono._id = produto.owner_id;
      this.selected_categoria._id = produto.category_id;

      this.editedItem = Object.assign({}, produto);

      this.dialog = true;
    },
    deleteItem(item) {
      const index = this.produtos.indexOf(item);

      if (confirm("Deseja realmente deletar esse item?")) {
        let id = this.produtos[this.produtos.indexOf(item)]._id;
        let api_url =
          process.env.VUE_APP_ENV === "dev"
            ? process.env.VUE_APP_API_URL_LOCAL
            : process.env.VUE_APP_API_URL;

        axios.delete(`${api_url}/products/delete/${id}`).then(response => {
          this.atualizarLista();
          this.$toast.open({
            message: "Produto deletado com sucesso",
            type: "success",
            position: "bottom",
            duration: 2000
          });
        });
      }
    },
    open() {
      this.limparForm();
      this.dialog = true;
    },
    close() {
      this.dialog = false;
      setTimeout(() => {
        this.limparForm();
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
    save() {
      if (this.editedIndex > -1) {
        let newProduto = {
          _id: this.editedItem._id,
          name: this.editedItem.name,
          amount: this.editedItem.amount,
          price_buy: this.editedItem.price_buy,
          price_sell: this.editedItem.price_sell,
          owner: this.selected_dono._id,
          category: this.selected_categoria._id
        };

        let api_url =
          process.env.VUE_APP_ENV === "dev"
            ? process.env.VUE_APP_API_URL_LOCAL
            : process.env.VUE_APP_API_URL;

        axios
          .put(`${api_url}/products/update/${newProduto._id}`, newProduto)
          .then(response => {
            this.atualizarLista();
            this.$toast.open({
              message: "Produto atualizado com sucesso",
              type: "success",
              position: "bottom",
              duration: 2000
            });
          });
      } else {
        let newProduto = {
          name: this.editedItem.name,
          amount: this.editedItem.amount,
          owner: {
            _id: this.selected_dono._id
          },
          category: {
            _id: this.selected_categoria._id
          },
          price_buy: this.editedItem.price_buy,
          price_sell: this.editedItem.price_sell
        };

        let api_url =
          process.env.VUE_APP_ENV === "dev"
            ? process.env.VUE_APP_API_URL_LOCAL
            : process.env.VUE_APP_API_URL;

        axios
          .post(`${api_url}/products`, {
            product: {
              name: newProduto.name,
              amount: newProduto.amount,
              owner: newProduto.owner,
              category: newProduto.category,
              price_buy: newProduto.price_buy,
              price_sell: newProduto.price_sell
            }
          })
          .then(response => {
            this.atualizarLista();
            this.$toast.open({
              message: "Produto criado com sucesso",
              type: "success",
              position: "bottom",
              duration: 2000
            });
          })
          .catch(response => {
            this.$toast.open({
              message: "Falha ao criar produto",
              type: "error",
              position: "bottom",
              duration: 2000
            });
          });
      }
      this.atualizarLista();
      this.atualizarListaDonos();
      this.atualizarListaCategorias();
      this.close();
    }
  }
};
</script>
