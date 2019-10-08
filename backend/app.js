const express = require("express");
const mongoose = require("mongoose");
require("dotenv/config");

const app = express();

// BODY PARSER
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ROUTER BIND
app.use('/api/v1/posts', require("./routes/api/v1/posts"));

// ENVIRONMENT VARS
const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DB_URL;

// DB CONNECTON
mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true}, () => {
  console.log("DB connected")
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
})
