require('dotenv').config();
const express = require('express');
const pool = require('./src/models/db');

const app = express();
app.use(express.json());

// Prueba de vida: confirma que la API corre y MySQL responde
app.get('/api/salud', async (req, res, next) => {
  try {
    await pool.query('SELECT 1');
    res.json({ estado: 'ok', baseDeDatos: 'conectada' });
  } catch (e) {
    next(e);
  }
});

// Paso 6: app.use('/api/v1/productos', require('./src/routes/productos'));
// Paso 8: app.use('/api/v1/pedidos', require('./src/routes/pedidos'));
// Paso 9: documentación Swagger

app.use((req, res) => res.status(404).json({ error: 'RUTA_NO_ENCONTRADA' }));
app.use(require('./src/middlewares/errores'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API en http://localhost:${PORT}`));