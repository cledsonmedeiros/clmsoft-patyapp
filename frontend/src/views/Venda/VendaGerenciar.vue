<template>
  <div>
    <v-data-table :headers="headers" :items="vendas" :search="searchVenda" sort-by="name" class="elevation-1" v-show="!this.overlay">
      <template v-slot:item.isPrazo="{ item }">
        <v-icon :color="getColor(item.isPrazo)">
          {{ item.isPrazo ? "mdi-credit-card-clock-outline" : "mdi-currency-usd" }}
        </v-icon>
      </template>
      <template v-slot:item.total="{ item }">
        {{ item.total.toFixed(2) }}
      </template>
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title class="mr-5">
            <div>
              <v-btn text icon color="purple" to="/novavenda">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </div>
          </v-toolbar-title>
          <div class="flex-grow-1"></div>
          <v-text-field color="purple" v-model="searchVenda" append-icon="mdi-magnify" label="Pesquisar" single-line hint="Vendas" persistent-hint></v-text-field>
          <v-dialog v-model="modal">
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-simple-table>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-center">Parcela</th>
                        <th class="text-center">De</th>
                        <th class="text-center">Vencimento</th>
                        <th class="text-center">Valor</th>
                        <th class="text-center">Status</th>
                        <th class="text-center">Ação</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in parcelas" :key="item.name">
                        <td class="text-center">{{ item.current }}</td>
                        <td class="text-center">{{ item.amount }}</td>
                        <td class="text-center">{{ item.date }}</td>
                        <td class="text-center">{{ item.price.toFixed(2) }}</td>
                        <td class="text-center">{{ item.isPaid ? "Pago" : "Em aberto" }}</td>
                        <td class="text-center">
                          <v-btn v-if="item.isPaid" small text color="green">Pago</v-btn>
                          <v-btn v-else small text color="purple" @click="receberParcela()">Receber</v-btn>
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-card-text>

              <v-card-actions>
                <div class="flex-grow-1"></div>
                <v-btn color="purple" text @click="fecharModal">Fechar</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon v-if="item.isPrazo" small color="blue" class="mr-2" @click="detalharVenda(item)">mdi-eye</v-icon>
        <v-icon small color="red" @click="cancelarVenda(item)">mdi-close</v-icon>
      </template>
    </v-data-table>
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script>
import axios from "axios";
import { mask } from "vue-the-mask";

export default {
  name: "VendasGerenciar",
  data: () => ({
    overlay: false,
    modal: false,
    searchVenda: "",
    headers: [
      { text: "Data", value: "date_complete" },
      { text: "Cliente", align: "start", value: "customer.name" },
      { text: "Pagamento", align: "end", value: "isPrazo" },
      { text: "Valor", align: "end", value: "total" },
      { text: "Ações", value: "action", sortable: false, align: "right" }
    ],
    vendas: [],
    parcelas: [],
    editedIndex: -1,
    api_url:
      process.env.VUE_APP_ENV === "dev"
        ? process.env.VUE_APP_API_URL_LOCAL
        : process.env.VUE_APP_API_URL
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Detalhes" : "Cancelar";
    }
  },
  watch: {
    modal(val) {
      val || this.fecharModal();
    }
  },
  created() {
    this.atualizarLista();
  },
  methods: {
    receberParcela(){
      alert("Função ainda não implementada")
    },
    changeOverlay() {
      this.overlay = !this.overlay;
    },
    getColor(bool) {
      if (bool) return "warning";
      else return "green";
    },
    atualizarLista() {
      this.changeOverlay();
      axios.get(`${this.api_url}/sell`).then(response => {
        this.vendas = response.data;
        this.changeOverlay();
      });
    },
    detalharVenda(item) {
      this.modal = true;
      let idVenda = item._id;
      axios.get(`${this.api_url}/split/sell/${idVenda}`).then(response => {
        // console.log(response.data);
        axios
          .get(`${this.api_url}/splititem/show/${response.data._id}`)
          .then(response => {
            console.log(response.data);
            this.parcelas = response.data;
          });
      });
    },
    cancelarVenda(item) {
      alert("Função ainda não implementada")
    },
    abrirModal() {
      this.modal = true;
    },
    fecharModal() {
      this.modal = false;
      this.parcelas = [];
    }
  }
};
</script>
