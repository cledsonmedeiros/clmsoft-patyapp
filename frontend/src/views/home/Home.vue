<template>
  <div>
    <v-container fluid text-center>
      <v-row>
        <v-col cols="12">
          <v-row align="start" justify="center">
            <v-card color="green" dark min-width="300" class="mx-1 mb-2">
              <v-card-text>
                <div class="title font-weight-light">
                  Vendas à vista do dia
                </div>
                <div class="headline font-weight-bold">
                  {{ Number(vendasDiaDinheiro.toFixed(2)).toLocaleString("pt-BR", {style: "currency", currency:"BRL"}) }}
                </div>
              </v-card-text>
            </v-card>
            <v-card color="orange" dark min-width="300" class="mx-1 mb-2">
              <v-card-text>
                <div class="title font-weight-light">
                  Vendas à prazo do dia
                </div>
                <div class="headline font-weight-bold">
                  {{ Number(vendasDiaPromissoria.toFixed(2)).toLocaleString("pt-BR", {style: "currency", currency:"BRL"}) }}
                </div>
              </v-card-text>
            </v-card>
            <v-card color="blue" dark min-width="300" class="mx-1 mb-2">
              <v-card-text>
                <div class="title font-weight-light">
                  Vendas à vista do mês
                </div>
                <div class="headline font-weight-bold">
                  {{ Number(vendasMesDinheiro.toFixed(2)).toLocaleString("pt-BR", {style: "currency", currency:"BRL"}) }}
                </div>
              </v-card-text>
            </v-card>
            <v-card color="red" dark min-width="300" class="mx-1 mb-2">
              <v-card-text>
                <div class="title font-weight-light">
                  Vendas à prazo do mês
                </div>
                <div class="headline font-weight-bold">
                  {{ Number(vendasMesPromissoria.toFixed(2)).toLocaleString("pt-BR", {style: "currency", currency:"BRL"}) }}
                </div>
              </v-card-text>
            </v-card>
          </v-row>
        </v-col>
      </v-row>

    </v-container>
  </div>
</template>
<script>
export default {
  name: "Home",
  components: {},
  data() {
    return {
      vendasDiaDinheiro: 0,
      vendasDiaPromissoria: 0,
      vendasMesDinheiro: 0,
      vendasMesPromissoria: 0,
    };
  },
  created(){
    this.getTotalVendasDiaDinheiro();
    this.getTotalVendasDiaPromissoria();
    this.getTotalVendasMesDinheiro();
    this.getTotalVendasMesPromissoria();
  },
  methods: {
    getTotalVendasDiaDinheiro(){
      this.$axios.get('venda/hoje/dinheiro').then(response => {
        response.data.forEach(element => {
          this.vendasDiaDinheiro += element.total
        });
      })
    },
    getTotalVendasDiaPromissoria(){
      this.$axios.get('venda/hoje/promissoria').then(response => {
        response.data.forEach(element => {
          this.vendasDiaPromissoria += element.total
        });
      })
    },
    getTotalVendasMesDinheiro(){
      this.$axios.get('venda/mes/dinheiro').then(response => {
        response.data.forEach(element => {
          this.vendasMesDinheiro += element.total
        });
      })
    },
    getTotalVendasMesPromissoria(){
      this.$axios.get('venda/mes/promissoria').then(response => {
        response.data.forEach(element => {
          this.vendasMesPromissoria += element.total
        });
      })
    },
  }
};
</script>
