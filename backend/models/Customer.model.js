const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
  },
  address: {
    type: String,
  },
  cpf: {
    type: String,
  },
});

module.exports = mongoose.model('Customer', CustomerSchema, 'Customer');
