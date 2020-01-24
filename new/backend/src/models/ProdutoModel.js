const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const produtoSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      trim: true,
      required: true,
    },
    quantidade: {
      type: Number,
      trim: true,
    },
    categoria: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'categoriaProduto',
    },
    preco_compra: {
      type: Number,
      required: true,
    },
    preco_revenda: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

produtoSchema.plugin(mongoosePaginate);

// produtoSchema.pre('save', function () {})

// produtoSchema.pre('remove', function () {})

module.exports = mongoose.model('produto', produtoSchema, 'produto');
