const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const itemSchema = new mongoose.Schema(
  {
    produto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'produto',
    },
    venda: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'venda',
    },
    quantidade: {
      type: Number,
      trim: true,
    },
    preco: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

itemSchema.plugin(mongoosePaginate);

// itemSchema.pre('save', function () {})

// itemSchema.pre('remove', function () {})

module.exports = mongoose.model('item', itemSchema, 'item');
