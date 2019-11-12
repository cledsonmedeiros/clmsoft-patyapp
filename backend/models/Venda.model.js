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
    ref: 'Cliente',
  },
  total: {
    type: Number,
    required: true,
  },
  total_paid: {
    type: Number,
    required: true,
  },
  isPrazo: {
    type: Boolean,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Venda', VendaSchema, 'Venda');
