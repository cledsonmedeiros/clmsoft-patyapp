<template>
  <div>
    <v-stepper v-model="passoAtual">
      <v-stepper-header>
        <v-stepper-step :alt-labels="true" :key="`${passoAtual}-step`" :complete="true" :complete-icon="`mdi-numeric-${passoAtual}`" :step="passoAtual">
          <span v-if="passoAtual === 1">Cliente</span>
          <span v-if="passoAtual === 2">Produtos</span>
          <span v-if="passoAtual === 3">Forma de pagamento</span>
        </v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content v-for="passo in quantidadePassos" :key="`${passo}-content`" :step="passo">
          <v-card v-if="passo === 1">
            <v-autocomplete v-model="itemAtual.cliente" :loading="carregandoClientes" :items="clientes" @change="habilitarBtnAvancar(passo)" :search-input.sync="pesquisaCliente" cache-items hide-no-data clearable item-text="nome" item-value="_id" label="Cliente" autocomplete="off" flat></v-autocomplete>
          </v-card>
          <v-card v-if="passo === 2" color="blue lighten-1" height="200px"></v-card>
          <v-card v-if="passo === 3" color="red lighten-1" height="200px"></v-card>

          <v-row class="mt-3">
            <v-container>
              <v-layout text-center wrap>
                <v-flex xs12 md4>
                  <v-btn color="error" dark class="mt-3" @click="retornar()">Cancelar</v-btn>
                </v-flex>
                <v-flex xs12 md4>
                  <v-btn color="primary" class="mt-3" v-if="passoAtual !== 1" @click="anteriorPasso(passo)">Voltar</v-btn>
                </v-flex>
                <v-flex xs12 md4>
                  <v-btn color="primary" class="mt-3" v-if="passoAtual !== 3" @click="proximoPasso(passo)" :disabled="estadoBtn">Avançar</v-btn>
                </v-flex>
              </v-layout>
            </v-container>
          </v-row>

        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </div>
</template>

<script>
export default {
  name: "NovaVenda",
  data() {
    return {
      estadoBtn: true,
      passoAtual: 1,
      quantidadePassos: 3,
      itemAtual: {
        nome: ""
      },
      carregandoClientes: false,
      clientes: [],
      pesquisaCliente: ""
    };
  },
  watch: {
    quantidadePassos(val) {
      if (this.passoAtual > val) {
        this.passoAtual = val;
      }
    },
    pesquisaCliente(nome) {
      if (nome !== null && nome !== undefined && nome.length > 0) {
        axios.get(`cliente/nome/${nome}`).then(response => {
          this.clientes = response.data;
        });
      }
    },
  },
  methods: {
    proximoPasso(passo) {
      if (passo === this.quantidadePassos) {
        this.passoAtual = 3;
      } else {
        this.passoAtual = passo + 1;
        this.estadoBtn = true;
      }
    },
    anteriorPasso(passo) {
      if (passo === 1) {
        this.passoAtual = 1;
      } else {
        this.passoAtual = passo - 1;
      }

      if(this.passoAtual === 1 && this.itemAtual.cliente.length === 24){
        this.estadoBtn = false;
      }else{
        this.estadoBtn = true;
      }
    },
    retornar() {
      window.history.back();
    },
    listarClientes() {
      this.$axios
        .get(`cliente/todos`)
        .then(response => {
          this.clientes = response.data;
        })
        .catch(() => {
          this.mostrarToast("Falha ao recuperar dados", "error");
        });
    },
    habilitarBtnAvancar(passo) {
      if (passo === 1) {
        if (
          this.itemAtual.cliente !== undefined &&
          this.itemAtual.cliente.length === 24
        ) {
          delete this.itemAtual.cliente.nome;
          this.estadoBtn = false;
        }else{
          this.estadoBtn = true;
        }
      }
    }
  },
  created() {
    this.listarClientes();
  }
};
</script>
