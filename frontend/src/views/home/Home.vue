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
    };
  },
  created(){
    this.getTotalVendasDiaDinheiro();
    this.getTotalVendasDiaPromissoria();
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
  }
};
</script>
