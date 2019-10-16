<template>
  <v-card class="mx-auto" outlined>
    <v-list-item three-line>
      <v-list-item-content>
        <div class="overline mb-4">Página não encontrada</div>
        <v-list-item-title class="headline mb-1">404</v-list-item-title>
        <v-list-item-subtitle>Clique no botão abaixo para retornar</v-list-item-subtitle>
      </v-list-item-content>

      <v-list-item-avatar tile size="80" color="purple">
        <v-icon dark>mdi-emoticon-sad</v-icon>
      </v-list-item-avatar>
    </v-list-item>

    <v-card-actions>
      <v-btn fab small color="purple" dark elevation="0" @click="voltar">
        <v-icon>mdi-reply</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  data: () => ({}),
  methods: {
    voltar() {
      window.history.back();
    }
  }
};
</script>
