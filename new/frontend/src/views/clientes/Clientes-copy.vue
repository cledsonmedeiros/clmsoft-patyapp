<template>
  <div>
    <v-data-table :headers="headers" :items="clientes" :page.sync="paginaAtual" :items-per-page="Number(itensPorPagina)" hide-default-footer class="elevation-1" :page-count="numeroPaginas"></v-data-table>
    <div class="text-center pt-2">
      <v-pagination v-model="paginaAtual" :length="numeroPaginas" @input="listarItens()"></v-pagination>
      <v-select :items="numeroElementos" label="Número de itens" v-model="itensPorPagina" return-object single-line item-text="valor" item-value="valor" @change="listarItens()"></v-select>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      numeroElementos: [
        {valor: '3'}, 
        {valor: '5'}, 
        {valor: '10'}, 
      ],
      paginaAtual: 1,
      numeroPaginas: 1,
      itensPorPagina: 5,
      headers: [
        {
          text: "Nome",
          align: "left",
          sortable: false,
          value: "nome"
        }
      ],
      clientes: []
    };
  },
  created() {
    this.listarItens();
  },
  methods: {
    listarItens() {
      this.$axios
        .get(`cliente?page=${this.paginaAtual}&limit=${this.itensPorPagina}`)
        .then(response => {
          this.clientes = response.data.docs;
          this.paginaAtual = response.data.page;
          this.numeroPaginas = response.data.totalPages;
          this.itensPorPagina = response.data.limit;
        })
    }
  }
};
</script>
