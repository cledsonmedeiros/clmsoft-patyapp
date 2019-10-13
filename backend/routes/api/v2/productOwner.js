const express = require('express');

const router = express.Router();
const ProdutoDono = require('../../../models/ProdutoDono.model');

// INDEX
router.get('/', (req, res) => {
  ProdutoDono.find({})
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// CREATE
router.post('/', (req, res) => {
  const { productowner } = req.body;
  const newProdutoDono = new ProdutoDono(productowner);
  newProdutoDono.save()
    .then((data) => {
      res.status(201).json(data);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// READ
router.get('/show/:id', (req, res) => {
  ProdutoDono.findById(req.params.id)
    .then((data) => {
      if (!data) {
        res.status(404).json({
          error: 'Product owner not found',
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
  ProdutoDono.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// DELETE
router.delete('/delete/:id', (req, res) => {
  ProdutoDono.findByIdAndDelete(req.params.id)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

module.exports = router;
