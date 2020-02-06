const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const usuarioSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      trim: true,
      required: true,
    },
    usuario: {
      type: String,
      trim: true,
      unique: true,
      dropDups: true,
      required: true,
    },
    senha: {
      type: String,
      trim: true,
      required: true,
    },
    ultimoLogin: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

usuarioSchema.plugin(mongoosePaginate);

// usuarioSchema.pre('save', function () {})

// usuarioSchema.pre('remove', function () {})

module.exports = mongoose.model('usuario', usuarioSchema, 'usuario');
