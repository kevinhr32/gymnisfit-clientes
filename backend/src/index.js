require('dotenv').config();

const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const conectarBaseDeDatos = require('./database');
const clientesRoutes = require('./routes/clientes.routes');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/api/salud', (_req, res) => {
  res.json({ mensaje: 'API de clientes funcionando.' });
});

app.use('/api/clientes', clientesRoutes);

app.use((_req, res) => {
  res.status(404).json({ mensaje: 'Ruta no encontrada.' });
});

async function iniciarServidor() {
  try {
    await conectarBaseDeDatos();
    app.listen(port, () => {
      console.log(`Servidor ejecutándose en http://localhost:${port}`);
    });
  } catch (error) {
    console.error('No fue posible conectar con MongoDB.');
    console.error(error.message);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  iniciarServidor();
}

module.exports = { app, iniciarServidor };
