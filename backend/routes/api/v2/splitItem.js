const express = require('express');

const router = express.Router();
const ItemParcela = require('../../../models/ItemParcela.model');

// INDEX
router.get('/', (req, res) => {
  ItemParcela.find({})
    // .populate({
    //   path: 'sell',
    //   model: 'Venda',
    //   populate: {
    //     path: 'customer',
    //     model: 'Customer',
    //   },
    // })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// CREATE
router.post('/', (req, res) => {
  const { splititem } = req.body;
  // console.log(splititem);
  const newItemParcela = new ItemParcela(splititem);
  newItemParcela.save()
    .then((data) => {
      res.status(201).json(data);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// READ
// router.get('/show/:id', (req, res) => {
//   ItemParcela.findById(req.params.id)
//     .populate({
//       path: 'sell',
//       model: 'Venda',
//       populate: {
//         path: 'customer',
//         model: 'Customer',
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

// UPDATE
// router.put('/update/:id', (req, res) => {
//   ItemParcela.findByIdAndUpdate(req.params.id, req.body, { new: true })
//     .then((data) => {
//       res.status(200).json(data);
//     })
//     .catch((err) => {
//       res.status(400).json(err);
//     });
// });

// DELETE
// router.delete('/delete/:id', (req, res) => {
//   ItemParcela.findByIdAndDelete(req.params.id)
//     .then((data) => {
//       res.status(200).json(data);
//     })
//     .catch((err) => {
//       res.status(400).json(err);
//     });
// });

// CUSTOM
// router.get('/category/:id', (req, res) => {
//   ItemParcela.find({ "category": req.params.id })
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
//   ItemParcela.find({ "name": { "$regex": req.params.name, "$options": "i" } })
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
