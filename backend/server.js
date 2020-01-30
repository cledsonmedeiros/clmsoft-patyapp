require('dotenv/config');
const mongoose = require('mongoose');
const app = require('./app');

const { PORT, DB_URL, DB_URL_DEV, ENV } = process.env;

mongoose.connect(ENV === 'prod' ? DB_URL : DB_URL_DEV,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  }, () => {
    console.log('Banco de dados conectado');

    app.listen(PORT || 3000, () => {
      console.log(`Servidor rodando em: http://localhost:${PORT}`);
      console.log(`Ambiente: ${ENV}`);
    });
  },
);
