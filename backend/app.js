const express = require('express');
const mongoose = require('mongoose');
require('dotenv/config');

const app = express();

// BODY PARSER
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ROUTER BIND
app.use('/api/v2/customers', require('./routes/api/v2/customers'));

// ENVIRONMENT VARS
const { PORT, DB_URL } = process.env;

// DB CONNECTON
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
  console.log('DB connected');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
