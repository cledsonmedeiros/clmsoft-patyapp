const mongoose = require('mongoose');

const ItemParcelaSchema = new mongoose.Schema({
  current: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  price: {
    type: Number,
    required: true,
  },
  split: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parcela',
  },
});

module.exports = mongoose.model('ItemParcela', ItemParcelaSchema, 'ItemParcela');
