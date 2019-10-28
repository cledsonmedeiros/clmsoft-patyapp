const mongoose = require('mongoose');

const ItemParcelaSchema = new mongoose.Schema({
  index: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  isPaid: {
    type: Boolean,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('ItemParcela', ItemParcelaSchema, 'ItemParcela');
