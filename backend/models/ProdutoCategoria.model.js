const mongoose = require('mongoose');

const ProdutoCategoriaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: {unique: true}
  }
});

module.exports = mongoose.model('ProdutoCategoria', ProdutoCategoriaSchema, 'ProdutoCategoria');
