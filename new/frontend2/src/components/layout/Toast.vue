<template>
  <div>
    <v-snackbar v-model="ativo" :color="cor" class="text-center" bottom :timeout="tempo">
      {{mensagem}}
      <i class="fas fa-check"></i>
    </v-snackbar>
  </div>
</template>
<script>
export default {
  name: "Toast",
  components: {},
  data() {
    return {
    };
  },
  props: {
    ativo: {
      Type: Boolean
    },
    mensagem: {
      Type: String
    },
    cor: {
      Type: String
    },
    tempo: {
      Type: Number
    },
  }
};
</script>
