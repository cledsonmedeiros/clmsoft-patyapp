const mongoose = require('mongoose');

const ItemVendaSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Produto',
  },
  total: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('ItemVenda', ItemVendaSchema, 'ItemVenda');
