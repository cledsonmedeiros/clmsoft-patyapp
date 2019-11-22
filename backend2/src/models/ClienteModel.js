const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const usuarioSchema = new mongoose.Schema(
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
      dropDups: true,
    },
  },
  {
    timestamps: true,
  },
);

usuarioSchema.plugin(mongoosePaginate);

// usuarioSchema.pre('save', function () {})

// usuarioSchema.pre('remove', function () {})

module.exports = mongoose.model('Usuario', usuarioSchema, 'Usuario');
