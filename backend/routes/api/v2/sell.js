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
  // console.log(sell);
  const newVenda = new Venda(sell);
  newVenda.save()
    .then((data) => {
      res.status(201).json(data._id);
    })
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

// READ
router.get('/show/:id', (req, res) => {
  Venda.findById(req.params.id)
    .populate('customer')
    .populate('produto')
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
router.delete('/delete/:id', (req, res) => {
  Venda.findByIdAndDelete(req.params.id)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// CUSTOM
// router.get('/category/:id', (req, res) => {
//   Venda.find({ "category": req.params.id })
//     .populate('owner')
//     .populate('category')
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

// router.get('/name/:name', (req, res) => {
//   Venda.find({ "name": { "$regex": req.params.name, "$options": "i" } })
//     .populate('owner')
//     .populate('category')
//     .then((data) => {
//       res.status(200).json(data);
//     })
//     .catch((err) => {
//       res.status(400).json(err);
//     });
// });

module.exports = router;
