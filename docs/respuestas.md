# TiendaAPI — Respuestas del taller

Materia: Programación Web IV

 Parte A  Express, rutas y controladores

## Pregunta 1
Para iniciar un proyecto de Node.js utilizamos npm init -y, que genera el archivo package.json. Este archivo almacena información del proyecto, dependencias y scripts para ejecutarlo.

### Pregunta 2
Nodemon reinicia automáticamente el servidor cuando detecta cambios en el código. Es útil durante el desarrollo porque ahorra tiempo. En producción se suele utilizar Node.js con un administrador de procesos apropiado.

### Pregunta 3
Las rutas reciben las solicitudes HTTP, los controladores gestionan la lógica de las peticiones y los modelos interactúan con la base de datos. En TiendaAPI utilizamos src/routes para rutas y src/models para el acceso a MySQL. La lógica de controladores se encuentra principalmente en las rutas.


### Pregunta 4
Express obtiene el identificador de /productos/:id mediante req.params.id. Separar las rutas de los controladores facilita el mantenimiento, la organización y las pruebas.

 Parte B — MySQL y CRUD

### Pregunta 5
La conexión necesita host, usuario, contraseña y nombre de la base. En TiendaAPI guardaremos estos valores en .env y excluiremos ese archivo de GitHub mediante .gitignore, evitando incluir credenciales directamente en el código.


### Pregunta 6
Nuestra base tiene las tablas categorias, productos, pedidos y pedido_items. Utilizamos claves primarias y foráneas para relacionarlas. productos.categoria_id referencia categorias.id, mientras pedido_items.pedido_id y pedido_items.producto_id relacionan pedidos y productos.


### Pregunta 7
Tabla de referencia con códigos REST habituales (pendiente de comparar con los utilizados en el video y con la sección 2.2.3 del módulo):

| Operación | Método | Ruta de ejemplo | Código |
|---|---|---|---|
| Crear | POST | /productos | 201 |
| Listar | GET | /productos | 200 |
| Consultar | GET | /productos/:id | 200 |
| Actualizar | PUT | /productos/:id | 200 |
| Eliminar | DELETE | /productos/:id | 204 |

### Pregunta 8
Las consultas parametrizadas utilizan ? para separar los valores proporcionados por los usuarios del código SQL. Esto ayuda a prevenir la inyección SQL. TiendaAPI utilizará consultas parametrizadas con mysql2.


## Paso 6 — Productos

### Pregunta 9
Un atacante podría intentar introducir una condición como ' OR '1'='1 para alterar una consulta construida mediante concatenación de texto. Los parámetros ? evitan que esos valores se interpreten como instrucciones SQL.

## Paso 7 — Pedidos

### Pregunta 10
PATCH permite actualizar parcialmente un recurso. Lo utilizamos para cambiar solamente el estado del pedido, sin reemplazar sus demás datos, como generalmente correspondería con PUT.

### Pregunta 11
Responderíamos 422, porque el cuerpo de la solicitud puede estar bien formado, pero contiene un producto inexistente que impide procesar el pedido. Es el código establecido en la guía para esta operación.

### Pregunta 12
pedido_items guarda precio_unitario para mantener el precio histórico de la compra. Si el producto aumenta posteriormente de precio, el total del pedido anterior no debe cambiar.

## Complemento opcional — Linux

### Pregunta 13
Apache cumple un papel parecido al de Nginx como servidor web. Sin embargo, Express puede atender solicitudes directamente en localhost:3000, sin necesitar Apache como intermediario.

### Pregunta 14
En CentOS Stream se puede instalar Nginx mediante sudo dnf install nginx. Para permitir HTTP y HTTPS se utilizan sudo firewall-cmd --permanent --add-service=http y sudo firewall-cmd --permanent --add-service=https, seguidos de sudo firewall-cmd --reload. Para permitir conexiones de Nginx hacia Node.js cuando SELinux las bloquea, se puede utilizar sudo setsebool -P httpd_can_network_connect on.


## Autoevaluación

**1. ¿Qué paso tomó más tiempo y cómo lo resolvieron?**
Pendiente de completar al finalizar.

**2. ¿Qué habría pasado en la prueba 8 sin la transacción?**
Pendiente de completar después de realizar las pruebas.

**3. Aporte de cada integrante:**
Pendiente de completar por ambos integrantes.

**4. Nota que se pondrían y justificación:**
Pendiente de completar al finalizar el proyecto.
