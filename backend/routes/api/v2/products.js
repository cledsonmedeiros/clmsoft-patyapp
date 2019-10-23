const express = require('express');

const router = express.Router();
const Produto = require('../../../models/Produto.model');

// INDEX
router.get('/', (req, res) => {
  Produto.find({})
    .populate('owner')
    .populate('category')
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// CREATE
router.post('/', (req, res) => {
  const { product } = req.body;
  const newProduto = new Produto(product);
  newProduto.save()
    .then((data) => {
      res.status(201).json(data);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// READ
router.get('/show/:id', (req, res) => {
  Produto.findById(req.params.id)
    .populate('owner')
    .populate('category')
    .then((data) => {
      if (!data) {
        res.status(404).json({
          error: 'Product not found',
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
router.put('/update/:id', (req, res) => {
  Produto.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// DELETE
router.delete('/delete/:id', (req, res) => {
  Produto.findByIdAndDelete(req.params.id)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// CUSTOM
router.get('/category/:id', (req, res) => {
  Produto.find({ "category": req.params.id, "amount": { "$gt": 0 } })
    .populate('owner')
    .populate('category')
    .then((data) => {
      if (!data) {
        res.status(404).json({
          error: 'Product not found',
        });
      } else {
        res.status(200).json(data);
      }
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.get('/name/:name', (req, res) => {
  Produto.find({
    "name": { "$regex": req.params.name, "$options": "i" },
    "amount": { "$gt": 0 },
  })
    .populate('owner')
    .populate('category')
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

module.exports = router;
