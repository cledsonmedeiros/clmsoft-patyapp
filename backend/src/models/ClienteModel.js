const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const clienteSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      trim: true,
      required: true,
    },
    telefone: {
      type: String,
      trim: true,
    },
    endereco: {
      type: String,
      trim: true,
    },
    cpf: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      dropDups: true,
    },
  },
  {
    timestamps: true,
  },
);

clienteSchema.plugin(mongoosePaginate);

// clienteSchema.pre('save', function () {})

// clienteSchema.pre('remove', function () {})

module.exports = mongoose.model('cliente', clienteSchema, 'cliente');
