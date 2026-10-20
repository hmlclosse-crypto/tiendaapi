
const express = require('express');
const pool = require('../models/db');

const router = express.Router();

// GET /api/v1/productos
// Lista productos con su categoría
router.get('/', async (req, res, next) => {
  try {
    const [productos] = await pool.query(`
      SELECT
        p.id,
        p.sku,
        p.nombre,
        p.precio,
        p.stock,
        c.nombre AS categoria
      FROM productos p
      LEFT JOIN categorias c
        ON p.categoria_id = c.id
      ORDER BY p.id
    `);

    res.status(200).json(productos);
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/productos/categoria/:nombre
// Filtra productos utilizando parámetros SQL
router.get('/categoria/:nombre', async (req, res, next) => {
  try {
    const { nombre } = req.params;

    const [productos] = await pool.query(`
      SELECT
        p.id,
        p.sku,
        p.nombre,
        p.precio,
        p.stock,
        c.nombre AS categoria
      FROM productos p
      INNER JOIN categorias c
        ON p.categoria_id = c.id
      WHERE c.nombre = ?
      ORDER BY p.id
    `, [nombre]);

    res.status(200).json(productos);
  } catch (error) {
    next(error);
  }
});


 // GET /api/v1/productos/:id
 // Consulta un producto específico
 router.get('/:id', async (req, res, next) => {
   try {
     const id = Number(req.params.id);

     if (!Number.isSafeInteger(id) || id <= 0) {
       return res.status(400).json({
         error: 'ID_INVALIDO',
         mensaje: 'El ID debe ser un número entero positivo'
       });
     }

     const [productos] = await pool.query(`
       SELECT
         p.id,
         p.sku,
         p.nombre,
         p.precio,
         p.stock,
         c.nombre AS categoria
       FROM productos p
       LEFT JOIN categorias c
         ON p.categoria_id = c.id
       WHERE p.id = ?
     `, [id]);

     if (productos.length === 0) {
       return res.status(404).json({
         error: 'PRODUCTO_NO_ENCONTRADO'
       });
     }

     res.status(200).json(productos[0]);
   } catch (error) {
     next(error);
   }
 });

 
 // POST /api/v1/productos
 router.post('/', async (req, res, next) => {
   try {
     const { sku, nombre, precio, stock, categoria_id } = req.body;

     if (
       typeof sku !== 'string' || !sku.trim() ||
       typeof nombre !== 'string' || !nombre.trim() ||
       typeof precio !== 'number' || !Number.isFinite(precio) ||
       precio < 0 ||
       !Number.isInteger(stock) || stock < 0 ||
       !Number.isSafeInteger(categoria_id) || categoria_id <= 0
     ) {
       return res.status(400).json({
         error: 'DATOS_INVALIDOS',
         mensaje: 'Revise sku, nombre, precio, stock y categoria_id'
       });
     }

     const [categorias] = await pool.query(
       'SELECT id FROM categorias WHERE id = ?',
       [categoria_id]
     );

     if (categorias.length === 0) {
       return res.status(422).json({
         error: 'CATEGORIA_NO_EXISTE'
       });
     }

     const [resultado] = await pool.query(
       `INSERT INTO productos
        (sku, nombre, precio, stock, categoria_id)
        VALUES (?, ?, ?, ?, ?)`,
       [sku.trim(), nombre.trim(), precio, stock, categoria_id]
     );

     res.status(201).json({
       mensaje: 'Producto creado correctamente',
       id: resultado.insertId
     });
   } catch (error) {
     if (error.code === 'ER_DUP_ENTRY') {
       return res.status(409).json({
         error: 'SKU_DUPLICADO'
       });
     }
     next(error);
   }
 });

 
 // PUT /api/v1/productos/:id
 router.put('/:id', async (req, res, next) => {
   try {
     const id = Number(req.params.id);
     const { precio, stock } = req.body;

     if (!Number.isSafeInteger(id) || id <= 0) {
       return res.status(400).json({
         error: 'ID_INVALIDO'
       });
     }

     if (
       typeof precio !== 'number' ||
       !Number.isFinite(precio) ||
       precio < 0 ||
       !Number.isSafeInteger(stock) ||
       stock < 0
     ) {
       return res.status(400).json({
         error: 'DATOS_INVALIDOS',
         mensaje: 'Precio y stock deben ser válidos'
       });
     }

     const [resultado] = await pool.query(
       'UPDATE productos SET precio = ?, stock = ? WHERE id = ?',
       [precio, stock, id]
     );

     if (resultado.affectedRows === 0) {
       return res.status(404).json({
         error: 'PRODUCTO_NO_ENCONTRADO'
       });
     }

     res.status(200).json({
       mensaje: 'Producto actualizado correctamente',
       id,
       precio,
       stock
     });
   } catch (error) {
     next(error);
   }
 });

module.exports = router;
