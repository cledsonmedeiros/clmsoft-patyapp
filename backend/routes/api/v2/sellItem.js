const express = require('express');

const router = express.Router();
const ItemVenda = require('../../../models/ItemVenda.model');

// INDEX
router.get('/', (req, res) => {
  ItemVenda.find({})
    .populate('product')
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
// router.get('/category/:id', (req, res) => {
//   ItemVenda.find({ "category": req.params.id })
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
