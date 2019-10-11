const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');

const app = express();

// CORS
app.use(cors());

// BODY PARSER
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ROUTER BIND
app.use('/api/v2/customers', require('./routes/api/v2/customers'));

// ENVIRONMENT VARS
const { PORT, DB_URL, NODE_ENV } = process.env;

// DB CONNECTON
mongoose.connect(NODE_ENV === "dev" ? DB_URL : DB_URL_PROD, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, () => {
  console.log('DB connected');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
