const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const categoriaProdutoSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      trim: true,
      required: true,
      index: { unique: true },
    },
  },
  {
    timestamps: true,
  },
);

categoriaProdutoSchema.plugin(mongoosePaginate);

// categoriaProdutoSchema.pre('save', function () {})

// categoriaProdutoSchema.pre('remove', function () {})

module.exports = mongoose.model('categoriaProduto', categoriaProdutoSchema, 'categoriaProduto');
