
# TiendaAPI

API REST desarrollada con Node.js, Express y MySQL para gestionar productos, inventario y pedidos.

## Tecnologías
- Node.js
- Express
- MySQL / MariaDB
- mysql2
- dotenv
- Swagger / OpenAPI
- Git y GitHub

## Instalación

1. Clonar el repositorio.
2. Ejecutar `npm install`.
3. Crear `.env` a partir de `.env.example`.
4. Configurar las credenciales de MySQL.
5. Crear la base de datos con `db/esquema.sql`.
6. Iniciar el servidor con `npm run dev`.

Nota: adaptar la contraseña de ejemplo de `db/esquema.sql` antes de ejecutar el script en una instalación nueva.

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| GET | /api/salud | Comprobar conexión |
| GET | /api/v1/productos | Listar productos |
| GET | /api/v1/productos/:id | Buscar producto |
| GET | /api/v1/productos/categoria/:nombre | Filtrar por categoría |
| POST | /api/v1/productos | Crear producto |
| PUT | /api/v1/productos/:id | Actualizar precio y stock |
| POST | /api/v1/pedidos | Crear pedido |

## Documentación Swagger

http://localhost:3000/api/docs/

## Transacciones

La creación de pedidos utiliza:

- BEGIN TRANSACTION
- SELECT ... FOR UPDATE
- COMMIT
- ROLLBACK

Esto permite verificar existencias, descontar inventario y evitar cambios parciales cuando falla una operación.

## Pruebas realizadas

- Conexión de API con MySQL.
- Listado de productos.
- Filtrado por categoría.
- Consulta por ID.
- Respuesta ante producto inexistente.
- Creación de producto.
- Actualización de precio y stock.
- Creación de pedido.
- Descuento de inventario.
- Rechazo por stock insuficiente.

## Seguridad

- Variables privadas en `.env`.
- Exclusión de `.env` y `node_modules` mediante `.gitignore`.
- Consultas SQL parametrizadas.
- Validaciones de datos.
- Manejo centralizado de errores.

## Documentación adicional

Consultar los archivos de la carpeta `docs`.

## Resultados de pruebas

Se realizaron las 12 pruebas indicadas en la guía del taller.

| Nº | Prueba | HTTP esperado | HTTP obtenido | Resultado |
|---|---|---|---|---|
| 1 | Crear pedido válido | 201 | 201 | Correcto |
| 2 | Verificar descuento de inventario | 200 | 200 | Correcto: stock 12 → 10 |
| 3 | Pedido sin cliente | 400 | 400 | Correcto |
| 4 | Pedido sin productos | 400 | 400 | Correcto |
| 5 | Cantidad negativa | 400 | 400 | Correcto |
| 6 | Producto inexistente | 422 | Error PRODUCTO_NO_ENCONTRADO |
| 7 | Stock insuficiente | 422 | 422 | Correcto |
| 8 | Verificar inventario tras rechazo | 200 | 200 | Correcto: stock sigue en 10 |
| 9 | Filtrar pedidos pendientes | 200 | 200 | Correcto |
| 10 | Consultar pedido inexistente | 404 | 404 | Correcto |
| 11 | Actualizar pedido a pagado | 200 | 200 | Correcto |
| 12 | Rechazar estado inválido | 400 | 400 | Correcto |

Las pruebas 7 y 8 confirmaron que un pedido rechazado
por falta de inventario no modifica las existencias.
