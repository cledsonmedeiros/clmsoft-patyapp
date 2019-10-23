const mongoose = require('mongoose');

const VendaSchema = new mongoose.Schema({
  date_complete: {
    type: String,
    required: true,
  },
  date_day: {
    type: String,
    required: true,
  },
  date_month: {
    type: String,
    required: true,
  },
  date_year: {
    type: String,
    required: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
  },
  total: {
    type: Number,
    required: true,
  },
  total_paid: {
    type: Number,
    required: true,
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'ItemVenda',
  }],
  isPrazo: {
    type: Boolean,
    // required: true,
  },
});

module.exports = mongoose.model('Venda', VendaSchema, 'Venda');
