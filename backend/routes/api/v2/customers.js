const express = require('express');

const router = express.Router();
const Customer = require('../../../models/Customer.model');

// RETURN ALL USERS
router.get('/', (req, res) => {
  Customer.find({})
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// CREATE USER
router.post('/', (req, res) => {
  const { customer } = req.body;
  const newCustomer = new Customer(customer);
  newCustomer.save()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

module.exports = router;
