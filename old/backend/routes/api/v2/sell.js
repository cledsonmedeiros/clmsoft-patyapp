const express = require('express');

const router = express.Router();
const Venda = require('../../../models/Venda.model');

// INDEX
router.get('/', (req, res) => {
  Venda.find({})
    .sort({ createdAt: -1 })
    .populate('customer')
    .populate({
      path: 'products',
      model: 'ItemVenda',
      populate: {
        path: 'product',
        model: 'Produto',
        populate: {
          path: 'owner',
          model: 'ProdutoDono',
        },
        populate: {
          path: 'category',
          model: 'ProdutoCategoria',
        },
      },
    })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// CREATE
router.post('/', (req, res) => {
  const { sell } = req.body;
  const newVenda = new Venda(sell);
  newVenda.save()
    .then((data) => {
      res.status(201).json(data);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// READ
router.get('/:id', (req, res) => {
  Venda.findById(req.params.id)
    .populate('customer')
    .populate({
      path: 'products',
      model: 'ItemVenda',
      populate: {
        path: 'product',
        model: 'Produto',
        populate: {
          path: 'owner',
          model: 'ProdutoDono',
        },
        populate: {
          path: 'category',
          model: 'ProdutoCategoria',
        },
      },
    })
    .then((data) => {
      if (!data) {
        res.status(404).json({
          error: 'Sell not found',
        });
      } else {
        res.status(200).json(data);
      }
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// UPDATE
// router.put('/update/:id', (req, res) => {
//   Venda.findByIdAndUpdate(req.params.id, req.body, { new: true })
//     .then((data) => {
//       res.status(200).json(data);
//     })
//     .catch((err) => {
//       res.status(400).json(err);
//     });
// });

// DELETE
// router.delete('/:id', (req, res) => {
//   Venda.findByIdAndDelete(req.params.id)
//     .then((data) => {
//       res.status(200).json(data);
//     })
//     .catch((err) => {
//       res.status(400).json(err);
//     });
// });

// CUSTOM
// router.get('/sell/:id', (req, res) => {
//   Venda.findById(req.params.id)
//     .populate('customer')
//     .populate({
//       path: 'products',
//       model: 'ItemVenda',
//       populate: {
//         path: 'product',
//         model: 'Produto',
//         populate: {
//           path: 'owner',
//           model: 'ProdutoDono',
//         },
//         populate: {
//           path: 'category',
//           model: 'ProdutoCategoria',
//         },
//       },
//     })
//     .then((data) => {
//       if (!data) {
//         res.status(404).json({
//           error: 'Sell not found',
//         });
//       } else {
//         res.status(200).json(data);
//       }
//     })
//     .catch((err) => {
//       res.status(400).json(err);
//     });
// });

// router.get('/owner/:id', (req, res) => {
//   const { id } = req.params;
//   Venda.find({ customer: id })
//     // .sort({ createdAt: -1 })
//     .populate('customer')
//     .populate({
//       path: 'products',
//       model: 'ItemVenda',
//       populate: {
//         path: 'product',
//         model: 'Produto',
//         populate: {
//           path: 'owner',
//           model: 'ProdutoDono',
//         },
//         populate: {
//           path: 'category',
//           model: 'ProdutoCategoria',
//         },
//       },
//     })
//     .then((data) => {
//       res.status(200).json(data);
//     })
//     .catch((err) => {
//       res.status(400).json(err);
//     });
// });

module.exports = router;
