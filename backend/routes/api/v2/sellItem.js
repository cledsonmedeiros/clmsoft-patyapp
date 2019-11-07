const express = require('express');

const router = express.Router();
const ItemVenda = require('../../../models/ItemVenda.model');

// INDEX
router.get('/', (req, res) => {
  ItemVenda.find({})
    .populate({
      path: 'product',
      model: 'Produto',
      populate: {
        path: 'owner',
        model: 'ProdutoDono',
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
  const { sellItem } = req.body;
  const newItemVenda = new ItemVenda(sellItem);
  newItemVenda.save()
    .then((data) => {
      // res.status(201).json({ id: data._id });
      res.status(201).json(data);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// READ
// router.get('/show/:id', (req, res) => {
//   ItemVenda.findById(req.params.id)
//     .populate('customer')
//     .populate('produto')
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

// UPDATE
// router.put('/update/:id', (req, res) => {
//   ItemVenda.findByIdAndUpdate(req.params.id, req.body, { new: true })
//     .then((data) => {
//       res.status(200).json(data);
//     })
//     .catch((err) => {
//       res.status(400).json(err);
//     });
// });

// DELETE
router.delete('/delete/:id', (req, res) => {
  ItemVenda.findByIdAndDelete(req.params.id)
    .populate('product')
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// CUSTOM
router.get('/owner/:id', (req, res) => {
  const { id } = req.params;
  ItemVenda.find({
    // product: id,
  })
    .populate({
      path: 'product',
      model: 'Produto',
      populate: {
        path: 'owner',
        model: 'ProdutoDono',
      },
    })
    .then((data) => {
      products = [];
      data.forEach((element) => {
        if (String(element.product.owner._id).trim() === String(id).trim()) {
          products.push(element);
        }
      });
      res.status(200).json(products);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// router.get('/name/:name', (req, res) => {
//   ItemVenda.find({ "name": { "$regex": req.params.name, "$options": "i" } })
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
