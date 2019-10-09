const express = require('express');

const router = express.Router();
const Customer = require('../../../models/Customer.model');

// INDEX
router.get('/', (req, res) => {
  Customer.find({})
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// CREATE
router.post('/', (req, res) => {
  const { customer } = req.body;
  const newCustomer = new Customer(customer);
  newCustomer.save()
    .then((data) => {
      res.status(201).json(data);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// READ
router.get('/show/:id', (req, res) => {
  Customer.findById(req.params.id)
    .then((data) => {
      if (!data) {
        res.status(404).json({
          error: 'Customer not found',
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
  Customer.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// DELETE
router.delete('/delete/:id', (req, res) => {
  Customer.findOneAndDelete(req.params.id)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

module.exports = router;
