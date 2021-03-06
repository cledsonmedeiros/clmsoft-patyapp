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
app.use('/api/v2/products', require('./routes/api/v2/products'));
app.use('/api/v2/productowner', require('./routes/api/v2/productOwner'));
app.use('/api/v2/productcategory', require('./routes/api/v2/productCategory'));
app.use('/api/v2/sell', require('./routes/api/v2/sell'));
app.use('/api/v2/sellitem', require('./routes/api/v2/sellItem'));
app.use('/api/v2/split', require('./routes/api/v2/split'));
app.use('/api/v2/splititem', require('./routes/api/v2/splitItem'));

// ENVIRONMENT VARS
const { PORT, DB_URL, NODE_ENV } = process.env;

// DB CONNECTON
mongoose.connect(NODE_ENV === "dev" ? DB_URL : DB_URL_PROD, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
}, () => {
  console.log('DB connected');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
