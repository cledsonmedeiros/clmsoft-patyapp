const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const categoriaSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      trim: true,
      required: true,
      index: { unique: true },
    },
  },
  {
    timestamps: true,
  },
);

categoriaSchema.plugin(mongoosePaginate);

// categoriaSchema.pre('save', function () {})

// categoriaSchema.pre('remove', function () {})

module.exports = mongoose.model('categoria', categoriaSchema, 'categoria');
