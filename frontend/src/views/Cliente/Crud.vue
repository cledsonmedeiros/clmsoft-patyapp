<template>
  <v-data-table
    :headers="headers"
    :items="desserts"
    sort-by="calorias"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>Sobremesas</v-toolbar-title>
        <div class="flex-grow-1"></div>

        <div class="flex-grow-1"></div>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn color="purple" outlined dark class="mb-2" v-on="on">
              <v-icon left="">mdi-plus</v-icon>
              <span>Criar</span>
              </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.nome" label="Nome"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.calorias" label="Calorias"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.gordura" label="Gordura"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.carboidratos" label="Carboidratos"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.proteina" label="Proteínas"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <div class="flex-grow-1"></div>
              <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
              <v-btn color="blue darken-1" text @click="save">Salvar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.action="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        small
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize">Reset</v-btn>
    </template>
  </v-data-table>
</template>

<script>
  export default {
    data: () => ({
      dialog: false,
      search: '',
      headers: [
        {
          text: 'Sobremesas',
          align: 'left',
          sortable: false,
          value: 'nome',
        },
        { text: 'Calorias', value: 'calorias' },
        { text: 'Gordura', value: 'gordura' },
        { text: 'Carboidratos', value: 'carboidratos' },
        { text: 'Proteínas', value: 'proteina' },
        { text: 'Ações', value: 'action', sortable: false },
      ],
      desserts: [],
      editedIndex: -1,
      editedItem: {
        nome: '',
        calorias: 0,
        gordura: 0,
        carboidratos: 0,
        proteina: 0,
      },
      defaultItem: {
        nome: '',
        calorias: 0,
        gordura: 0,
        carboidratos: 0,
        proteina: 0,
      },
    }),
    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Criar' : 'Editar'
      },
    },
    watch: {
      dialog (val) {
        val || this.close()
      },
    },
    created () {
      this.initialize()
    },
    methods: {
      initialize () {
        this.desserts = [
          {
            nome: 'Frozen Yogurt',
            calorias: 159,
            gordura: 6.0,
            carboidratos: 24,
            proteina: 4.0,
          },
          {
            nome: 'Ice cream sandwich',
            calorias: 237,
            gordura: 9.0,
            carboidratos: 37,
            proteina: 4.3,
          },
          {
            nome: 'Eclair',
            calorias: 262,
            gordura: 16.0,
            carboidratos: 23,
            proteina: 6.0,
          },
          {
            nome: 'Cupcake',
            calorias: 305,
            gordura: 3.7,
            carboidratos: 67,
            proteina: 4.3,
          },
          {
            nome: 'Gingerbread',
            calorias: 356,
            gordura: 16.0,
            carboidratos: 49,
            proteina: 3.9,
          },
          {
            nome: 'Jelly bean',
            calorias: 375,
            gordura: 0.0,
            carboidratos: 94,
            proteina: 0.0,
          },
          {
            nome: 'Lollipop',
            calorias: 392,
            gordura: 0.2,
            carboidratos: 98,
            proteina: 0,
          },
          {
            nome: 'Honeycomb',
            calorias: 408,
            gordura: 3.2,
            carboidratos: 87,
            proteina: 6.5,
          },
          {
            nome: 'Donut',
            calorias: 452,
            gordura: 25.0,
            carboidratos: 51,
            proteina: 4.9,
          },
          {
            nome: 'KitKat',
            calorias: 518,
            gordura: 26.0,
            carboidratos: 65,
            proteina: 7,
          },
        ]
      },
      editItem (item) {
        this.editedIndex = this.desserts.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },
      deleteItem (item) {
        const index = this.desserts.indexOf(item)
        confirm('Deseja realmente deletar esse item?') && this.desserts.splice(index, 1)
      },
      close () {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },
      save () {
        if (this.editedIndex > -1) {
          Object.assign(this.desserts[this.editedIndex], this.editedItem)
        } else {
          this.desserts.push(this.editedItem)
        }
        this.close()
      },
    },
  }
</script>
