const mongoose = require('mongoose');

const ParcelaSchema = new mongoose.Schema({
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
    ref: 'ItemParcela',
    default: null,
  }],
  isAllPaid: {
    type: Boolean,
    default: false,
  },
  sell: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Venda',
  },
});

module.exports = mongoose.model('Parcela', ParcelaSchema, 'Parcela');
