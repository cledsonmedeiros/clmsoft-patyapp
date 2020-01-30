const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const parcelaSchema = new mongoose.Schema(
  {
    venda: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'venda',
      required: true,
    },
    data: {
      type: String,
      trim: true,
      required: true,
    },
    valor: {
      type: Number,
      required: true,
    },
    ordem: {
      type: Number,
      required: true,
    },
    isPaga: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

parcelaSchema.plugin(mongoosePaginate);

// parcelaSchema.pre('save', function () {})

// parcelaSchema.pre('remove', function () {})

module.exports = mongoose.model('parcela', parcelaSchema, 'parcela');
