
const express = require('express');
const pool = require('../models/db');

const router = express.Router();

// POST /api/v1/pedidos
router.post('/', async (req, res, next) => {
  const { cliente_nombre, cliente_correo, items } = req.body || {};

  // Validar los datos del pedido
  if (
    typeof cliente_nombre !== 'string' ||
    !cliente_nombre.trim() ||
    cliente_nombre.length > 120 ||
    typeof cliente_correo !== 'string' ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cliente_correo) ||
    cliente_correo.length > 160 ||
    !Array.isArray(items) ||
    items.length === 0 ||
    items.some(item =>
      !item ||
      !Number.isSafeInteger(item.producto_id) ||
      item.producto_id <= 0 ||
      !Number.isSafeInteger(item.cantidad) ||
      item.cantidad <= 0
    )
  ) {
    return res.status(400).json({
      error: 'DATOS_INVALIDOS',
      mensaje: 'Revise los datos del cliente y los productos'
    });
  }

  // Evitar repetir productos en un mismo pedido
  const ids = items.map(item => item.producto_id);

  if (new Set(ids).size !== ids.length) {
    return res.status(400).json({
      error: 'PRODUCTOS_REPETIDOS'
    });
  }

  let conexion;

  try {
    conexion = await pool.getConnection();
    await conexion.beginTransaction();

    let totalCentavos = 0;
    const detalles = [];

    // Orden fijo para reducir riesgo de bloqueos
    const ordenados = [...items].sort(
      (a, b) => a.producto_id - b.producto_id
    );

    for (const item of ordenados) {
      // Bloquear producto mientras dura la transacción
      const [productos] = await conexion.query(
        `SELECT id, nombre, precio, stock
         FROM productos
         WHERE id = ?
         FOR UPDATE`,
        [item.producto_id]
      );

      if (productos.length === 0) {
        await conexion.rollback();

        return res.status(422).json({
          error: 'PRODUCTO_NO_ENCONTRADO',
          producto_id: item.producto_id
        });
      }

      const producto = productos[0];

      if (producto.stock < item.cantidad) {
        await conexion.rollback();

        return res.status(422).json({
          error: 'STOCK_INSUFICIENTE',
          producto_id: item.producto_id,
          disponible: producto.stock
        });
      }

      const precioCentavos = Math.round(
        Number(producto.precio) * 100
      );

      totalCentavos += precioCentavos * item.cantidad;

      detalles.push({
        producto_id: producto.id,
        cantidad: item.cantidad,
        precio_unitario: producto.precio
      });
    }

    const total = totalCentavos / 100;

    // Crear pedido
    const [resultado] = await conexion.query(
      `INSERT INTO pedidos
       (cliente_nombre, cliente_correo, estado, total)
       VALUES (?, ?, 'pendiente', ?)`,
      [cliente_nombre.trim(), cliente_correo.trim(), total]
    );

    const pedidoId = resultado.insertId;

    for (const detalle of detalles) {
      // Guardar detalle del pedido
      await conexion.query(
        `INSERT INTO pedido_items
         (pedido_id, producto_id, cantidad, precio_unitario)
         VALUES (?, ?, ?, ?)`,
        [
          pedidoId,
          detalle.producto_id,
          detalle.cantidad,
          detalle.precio_unitario
        ]
      );

      // Descontar existencias
      await conexion.query(
        `UPDATE productos
         SET stock = stock - ?
         WHERE id = ?`,
        [detalle.cantidad, detalle.producto_id]
      );
    }

    // Confirmar todas las operaciones
    await conexion.commit();

    return res.status(201).json({
      mensaje: 'Pedido creado correctamente',
      pedido_id: pedidoId,
      estado: 'pendiente',
      total,
      items: detalles
    });

  } catch (error) {
    if (conexion) {
      try {
        await conexion.rollback();
      } catch (rollbackError) {
        console.error('Error en rollback:', rollbackError);
      }
    }

    next(error);
  } finally {
    if (conexion) conexion.release();
  }
});


const ESTADOS = ['pendiente', 'pagado', 'enviado', 'cancelado'];

// GET /api/v1/pedidos
// Listar todos los pedidos o filtrar por estado
router.get('/', async (req, res, next) => {
  const { estado } = req.query;

  if (estado !== undefined && !ESTADOS.includes(estado)) {
    return res.status(400).json({
      error: 'ESTADO_INVALIDO',
      mensaje: 'Estado no permitido'
    });
  }

  try {
    let sql = `
      SELECT id, cliente_nombre, cliente_correo,
             estado, total, creado_en
      FROM pedidos
    `;

    const parametros = [];

    if (estado !== undefined) {
      sql += ' WHERE estado = ?';
      parametros.push(estado);
    }

    sql += ' ORDER BY creado_en DESC, id DESC';

    const [pedidos] = await pool.query(sql, parametros);

    return res.status(200).json(pedidos);
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/pedidos/:id
// Consultar un pedido y sus productos
router.get('/:id', async (req, res, next) => {
  const id = Number(req.params.id);

  if (!Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).json({
      error: 'ID_INVALIDO',
      mensaje: 'El ID debe ser un entero positivo'
    });
  }

  try {
    const [pedidos] = await pool.query(
      `SELECT id, cliente_nombre, cliente_correo,
              estado, total, creado_en
       FROM pedidos
       WHERE id = ?`,
      [id]
    );

    if (pedidos.length === 0) {
      return res.status(404).json({
        error: 'PEDIDO_NO_ENCONTRADO',
        mensaje: 'El pedido no existe'
      });
    }

    const [items] = await pool.query(
      `SELECT pi.producto_id, p.nombre,
              pi.cantidad, pi.precio_unitario
       FROM pedido_items pi
       INNER JOIN productos p
       ON p.id = pi.producto_id
       WHERE pi.pedido_id = ?
       ORDER BY pi.id`,
      [id]
    );

    return res.status(200).json({
      ...pedidos[0],
      items
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/v1/pedidos/:id
// Actualizar solamente el estado del pedido
router.patch('/:id', async (req, res, next) => {
  const id = Number(req.params.id);
  const { estado } = req.body || {};

  if (!Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).json({
      error: 'ID_INVALIDO',
      mensaje: 'El ID debe ser un entero positivo'
    });
  }

  if (!ESTADOS.includes(estado)) {
    return res.status(400).json({
      error: 'ESTADO_INVALIDO',
      mensaje: 'Use pendiente, pagado, enviado o cancelado'
    });
  }

  try {
    const [resultado] = await pool.query(
      `UPDATE pedidos
       SET estado = ?
       WHERE id = ?`,
      [estado, id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        error: 'PEDIDO_NO_ENCONTRADO',
        mensaje: 'El pedido no existe'
      });
    }

    return res.status(200).json({
      mensaje: 'Estado actualizado correctamente',
      pedido_id: id,
      estado
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
