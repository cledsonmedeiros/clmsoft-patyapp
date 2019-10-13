const mongoose = require('mongoose');

const ProdutoDonoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: {unique: true}
  }
});

module.exports = mongoose.model('ProdutoDono', ProdutoDonoSchema, 'ProdutoDono');
