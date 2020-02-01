const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const vendaSchema = new mongoose.Schema(
  {
    // data: {
    //   type: String,
    //   trim: true,
    //   required: true,
    // },
    isPrazo: {
      type: Boolean,
      required: true,
    },
    isConcluida: {
      type: Boolean,
      required: true,
    },
    cliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'cliente',
      required: false,
    },
    vendedor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'usuario',
      required: true,
    },
    total: {
      type: Number,
      required: true,
    }
  },
  {
    timestamps: true,
  },
);

vendaSchema.plugin(mongoosePaginate);

// vendaSchema.pre('save', function () {})

// vendaSchema.pre('remove', function () {})

module.exports = mongoose.model('venda', vendaSchema, 'venda');
