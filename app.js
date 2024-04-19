const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const rutas = require('./js/etl-rutas'); // Importa las rutas desde rutas.js

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Agregar un middleware de registro de solicitudes
app.use((req, res, next) => {
  console.log(`Solicitud recibida: ${req.method} ${req.url}`);
  next();
});

// Usar el enrutador definido en rutas.js
app.use('/api', rutas);


app.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');
});
