const mongoose = require('mongoose');

const ProdutoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProdutoDono'
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProdutoCategoria'
  },
  price_buy: {
    type: Number,
    required: true
  },
  price_sell: {
    type: Number,
    required: true
  },
});

module.exports = mongoose.model('Produto', ProdutoSchema, 'Produto');
