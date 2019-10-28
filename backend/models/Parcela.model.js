const mongoose = require('mongoose');

const VendaSchema = new mongoose.Schema({
  period: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  splits: [{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'ItemParcela',
  }],
  isAllPaid: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model('Venda', VendaSchema, 'Venda');
