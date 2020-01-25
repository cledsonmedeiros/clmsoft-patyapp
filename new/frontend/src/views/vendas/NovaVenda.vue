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
          <v-card v-if="passo === 1" color="grey lighten-1" height="200px"></v-card>
          <v-card v-if="passo === 2" color="blue lighten-1" height="200px"></v-card>
          <v-card v-if="passo === 3" color="red lighten-1" height="200px"></v-card>

          <v-row class="mt-3">
            <v-col>
            </v-col>
            <v-spacer></v-spacer>
            <v-col style="flex-grow: 0;">
              <v-btn color="primary" text @click="retornar()">Cancelar</v-btn>
            </v-col>
            <v-col v-if="passoAtual !== 1" style="flex-grow: 0;">
              <v-btn color="primary" @click="anteriorPasso(passo)">Voltar</v-btn>
            </v-col>
            <v-col v-if="passoAtual !== 3" style="flex-grow: 0;">
              <v-btn color="primary" @click="proximoPasso(passo)">Avançar</v-btn>
            </v-col>
            <v-spacer></v-spacer>
            <v-col>
            </v-col>
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
      passoAtual: 1,
      quantidadePassos: 3
    };
  },
  watch: {
    quantidadePassos(val) {
      if (this.passoAtual > val) {
        this.passoAtual = val;
      }
    }
  },
  methods: {
    proximoPasso(passo) {
      if (passo === this.quantidadePassos) {
        this.passoAtual = 3;
      } else {
        this.passoAtual = passo + 1;
      }
    },
    anteriorPasso(passo){
      if (passo === 1) {
        this.passoAtual = 1;
      } else {
        this.passoAtual = passo - 1;
      }
    },
    retornar(){
      window.history.back();
    }
  }
};
</script>
