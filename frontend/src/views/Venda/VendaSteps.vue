<template>
  <div>
    <v-stepper v-model="e1" non-linear>
      <v-stepper-header>
        <v-stepper-step editable step="1">Select campaign settings</v-stepper-step>
        <v-stepper-content step="1">
          <v-card class="mb-12" color="grey lighten-1" height="200px"></v-card>
<!--
          <v-btn color="primary" @click="">Continue</v-btn>

          <v-btn text>Cancel</v-btn> -->
        </v-stepper-content>
        <v-divider></v-divider>

        <v-stepper-step editable step="2">Create an ad group</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step step="3" editable>Create an ad</v-stepper-step>
      </v-stepper-header>
    </v-stepper>
  </div>
</template>
<script>
export default {
  data() {
    return {
      e1: 1
    }
  }
}
</script>
