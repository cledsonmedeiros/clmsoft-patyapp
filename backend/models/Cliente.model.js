const mongoose = require('mongoose');

const ClienteSchema = new mongoose.Schema({
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

module.exports = mongoose.model('Cliente', ClienteSchema, 'Cliente');
