<template>
  <div>
    <v-data-table :headers="headers" :items="clientes" :page.sync="paginaAtual" :items-per-page="Number(itensPorPagina)" hide-default-footer class="elevation-1" :page-count="numeroPaginas"></v-data-table>
    <div class="text-center pt-2">
      <v-pagination v-model="paginaAtual" :length="numeroPaginas" @input="listarItens()"></v-pagination>
      <v-select :items="numeroElementos" label="Número de itens" v-model="itensPorPagina" @change="listarItens(n=true)"></v-select>
    </div>
  </div>
</template>

<script>
export default {
  name: "clientes",
  data() {
    return {
      numeroElementos: ["3", "5", "10"],
      paginaAtual: 1,
      numeroPaginas: 1,
      itensPorPagina: "5",
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
    listarItens(n = false) {
      console.log(n);
      this.$axios
        .get(`cliente?page=${n ? 1 : this.paginaAtual}&limit=${this.itensPorPagina}`)
        .then(response => {
          this.clientes = response.data.docs;
          this.paginaAtual = n ? 1 : response.data.page;
          this.numeroPaginas = response.data.totalPages;
          this.itensPorPagina = String(response.data.limit);
        });
    }
  }
};
</script>
