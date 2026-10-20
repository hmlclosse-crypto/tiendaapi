# TiendaAPI — Respuestas del taller

**Materia:** INF 323 — Programación Web IV  
**Taller:** TiendaAPI — API REST con Node.js, Express y MySQL

---

## Parte A — Express, rutas y controladores

### Pregunta 1. ¿Qué comando inicia un proyecto de Node.js y qué archivo crea? ¿Para qué sirve ese archivo?

Para iniciar un proyecto de Node.js utilizamos el comando `npm init -y`, que genera automáticamente el archivo `package.json`.

Este archivo almacena información importante del proyecto, como su nombre, versión, dependencias y scripts necesarios para ejecutar la aplicación. En TiendaAPI lo utilizamos para administrar las librerías instaladas y configurar comandos como `npm run dev` y `npm start`.

### Pregunta 2. ¿Qué hace nodemon y por qué conviene durante el desarrollo, pero no en producción?

Nodemon es una herramienta que reinicia automáticamente el servidor cuando detecta modificaciones en los archivos del proyecto.

Es útil durante el desarrollo porque permite comprobar los cambios sin detener y ejecutar manualmente el servidor cada vez. En producción es preferible utilizar Node.js con un administrador de procesos adecuado, como PM2, que permite supervisar y mantener funcionando la aplicación.

### Pregunta 3. Dibujen o describan las carpetas que crea el instructor. ¿Cuál equivale a src/routes y a src/models de TiendaAPI?

El instructor organiza la aplicación separando responsabilidades, siguiendo una estructura similar al patrón MVC (Modelo-Vista-Controlador).

Las carpetas de rutas y controladores se encargan de recibir las solicitudes HTTP y procesar las operaciones correspondientes. Estas funciones equivalen principalmente a nuestra carpeta `src/routes`, donde definimos los endpoints de productos y pedidos.

Por otro lado, la carpeta destinada a los modelos o al acceso a la base de datos equivale a `src/models` de TiendaAPI, donde configuramos la conexión con MySQL.

En nuestro proyecto, la lógica de los controladores está integrada directamente en los archivos de rutas, por lo que no utilizamos una carpeta independiente de controladores.

### Pregunta 4. En una ruta como /productos/:id, ¿cómo obtiene el código el valor de id? ¿Qué ventaja tiene separar la ruta del controlador?

Express obtiene el identificador mediante `req.params.id`.

Por ejemplo, cuando un usuario consulta `/productos/5`, el servidor recibe el valor `5` como parámetro y puede utilizarlo para buscar el producto correspondiente en MySQL.

Separar las rutas de los controladores facilita la organización del código, su mantenimiento, reutilización y realización de pruebas.

---

## Parte B — MySQL y operaciones CRUD

### Pregunta 5. ¿Dónde escribe el instructor los datos de conexión? Comparen con lo que harán ustedes en el Paso 4 (archivo .env). ¿Cuál es más seguro y por qué?

Según lo observado en el video, el instructor escribe las credenciales de conexión, como host, usuario y contraseña, directamente en un archivo de configuración del código.

En TiendaAPI utilizamos un método diferente: almacenamos las credenciales en el archivo `.env` y accedemos a ellas mediante variables de entorno utilizando `dotenv`.

Este método es más seguro porque `.env` está incluido en `.gitignore`, evitando que las credenciales se publiquen accidentalmente al subir el proyecto a GitHub.

De esta manera, podemos compartir el código fuente sin compartir las contraseñas de la base de datos.

### Pregunta 6. Comparen sus tablas con las de tienda que crearon en el Paso 2. ¿Qué tienen en común? ¿Qué clave foránea aparece en ambas?

Ambas estructuras utilizan el modelo de bases de datos relacionales, donde las tablas se relacionan mediante identificadores.

Tienen en común el uso de claves primarias, generalmente autoincrementales, y claves foráneas que permiten mantener la integridad referencial de los datos.

En nuestra base de datos TiendaAPI utilizamos cuatro tablas: `categorias`, `productos`, `pedidos` y `pedido_items`.

Una clave foránea importante es `producto_id`, ubicada en `pedido_items`, que referencia el campo `id` de la tabla `productos`. Esto permite relacionar los productos con los pedidos y evita registrar referencias a productos inexistentes.

También utilizamos `productos.categoria_id` para relacionar los productos con sus categorías y `pedido_items.pedido_id` para asociar los detalles con cada pedido.

### Pregunta 7. Hagan una tabla con cada operación del CRUD del video: verbo, ruta y código de estado que responde. Marquen cualquier código que no coincida con la tabla 2.2.3 de la guía del módulo.

Las operaciones CRUD permiten crear, consultar, actualizar y eliminar registros mediante distintos métodos HTTP.

| Operación | Método HTTP | Ruta de ejemplo | Código de estado |
|---|---|---|---|
| Crear (Create) | POST | `/api/usuarios` | 201 Created |
| Listar (Read) | GET | `/api/usuarios` | 200 OK |
| Consultar por ID (Read) | GET | `/api/usuarios/:id` | 200 OK |
| Actualizar (Update) | PUT / PATCH | `/api/usuarios/:id` | 200 OK |
| Eliminar (Delete) | DELETE | `/api/usuarios/:id` | 200 OK |

Estos códigos representan las respuestas indicadas en la información proporcionada sobre el video y corresponden a usos habituales de HTTP.

Es importante señalar que una eliminación también puede responder con `204 No Content` cuando se completa correctamente sin devolver contenido.

La coincidencia exacta con la tabla 2.2.3 del módulo requiere consultar dicha tabla.

### Pregunta 8. ¿Las consultas SQL del video usan parámetros (?) o concatenan texto? Expliquen por qué los parámetros evitan la inyección SQL.

Según la información revisada del video, las consultas utilizan parámetros mediante el marcador `?`.

Los parámetros ayudan a prevenir la inyección SQL porque permiten separar los valores proporcionados por el usuario de la estructura de la consulta.

Por ejemplo, un atacante podría intentar introducir una expresión como `' OR 1=1 --` para modificar las condiciones de una consulta vulnerable construida mediante concatenación.

Al utilizar consultas parametrizadas correctamente, esos valores se procesan como datos y no como instrucciones SQL.

En TiendaAPI utilizamos consultas parametrizadas con `mysql2`, lo cual mejora la seguridad de las operaciones realizadas sobre la base de datos.

---

## Paso 6 — Productos

### Pregunta 9. ¿Cómo podría un atacante aprovechar una consulta SQL construida mediante concatenación y cómo se evita?

Un atacante podría introducir contenido malicioso en un campo de búsqueda para modificar una consulta SQL si la aplicación concatena directamente los datos proporcionados por el usuario.

Por ejemplo, podría intentar utilizar una condición como `' OR '1'='1` para alterar los filtros de una consulta y obtener información que no debería mostrarse.

Para prevenirlo, utilizamos consultas parametrizadas con marcadores `?`, que permiten enviar los valores separadamente de la sentencia SQL.

En TiendaAPI aplicamos esta técnica en las operaciones de consulta, creación y actualización de productos.

---

## Paso 7 — Pedidos

### Pregunta 10. ¿Por qué se utiliza PATCH para actualizar el estado de un pedido en lugar de PUT?

PATCH permite modificar parcialmente un recurso, mientras que PUT se utiliza normalmente para reemplazar su representación completa.

En TiendaAPI, PATCH resulta adecuado para actualizar solamente el estado de un pedido, por ejemplo, de `pendiente` a `pagado`, sin modificar los datos del cliente, los productos o el total.

Esto permite realizar actualizaciones específicas sin alterar los demás campos del pedido.

### Pregunta 11. ¿Qué código HTTP corresponde cuando un pedido contiene un producto que no existe?

Según lo establecido en la guía del módulo para esta operación, corresponde utilizar el código HTTP `422 Unprocessable Content`.

Este código indica que la solicitud tiene una estructura válida, pero contiene información que impide procesarla correctamente.

Por ejemplo, si un cliente intenta crear un pedido con un identificador de producto inexistente, el sistema puede rechazar la operación y devolver una respuesta que explique el problema.

### Pregunta 12. ¿Por qué la tabla pedido_items almacena el precio_unitario de cada producto?

La tabla `pedido_items` almacena el campo `precio_unitario` para conservar el precio histórico de cada producto al momento de realizar la compra.

Esto es importante porque los precios del catálogo pueden modificarse posteriormente.

Por ejemplo, si un producto se compró a $30.00 y después aumenta a $35.00, el pedido anterior debe continuar reflejando el precio original de $30.00.

De esta manera, se mantiene la integridad del historial de compras y de los totales registrados.

---


### Pregunta 13. En su computadora, ¿qué programa cumple un papel parecido al de Nginx en el video y por qué su API Node.js no lo necesita para funcionar en localhost:3000?

En nuestra computadora utilizamos Apache mediante XAMPP, que cumple un papel parecido al de Nginx como servidor web.

Sin embargo, nuestra API desarrollada con Node.js y Express no necesita Apache para funcionar en `localhost:3000`, porque Express puede escuchar y responder directamente a las solicitudes HTTP.

En nuestro proyecto utilizamos XAMPP principalmente para ejecutar MySQL y administrar la base de datos mediante phpMyAdmin.

### Pregunta 14. Escriban los dos comandos de CentOS que reemplazan a apt install nginx y ufw allow 'Nginx Full', y el comando que evita el error 502 Bad Gateway causado por SELinux.

En CentOS Stream 10 utilizamos `dnf` para instalar paquetes y `firewall-cmd` para administrar las reglas del firewall.

**Instalación de Nginx:**

`sudo dnf install nginx`

**Habilitar los servicios HTTP y HTTPS:**

`sudo firewall-cmd --permanent --add-service=http --add-service=https`

**Aplicar los cambios del firewall:**

`sudo firewall-cmd --reload`

**Permitir que Nginx se comunique con Node.js cuando SELinux bloquea la conexión:**

`sudo setsebool -P httpd_can_network_connect on`

Este último comando habilita la capacidad de conexión de red necesaria para que Nginx pueda actuar como proxy inverso y reenviar solicitudes hacia la aplicación Node.js.

---

## Autoevaluación

### 1. ¿Qué paso tomó más tiempo y cómo lo resolvieron?

El paso que más tiempo nos tomó fue la configuración inicial y la conexión entre Node.js, Express y MySQL, especialmente al configurar los usuarios, permisos y credenciales de la base de datos.

Durante el desarrollo encontramos algunos errores de conexión que nos obligaron a revisar la configuración y realizar diferentes pruebas. También dedicamos tiempo a implementar los endpoints y comprobar que las transacciones actualizaran correctamente el inventario.

Logramos resolver estas dificultades mediante la investigación, la revisión de los mensajes de error, el trabajo organizado y las pruebas realizadas hasta conseguir que la API funcionara correctamente.

### 2. ¿Qué habría pasado en la prueba 8 sin la transacción?

Sin una transacción, si el sistema hubiera descontado unidades del primer producto y posteriormente hubiera detectado que el segundo producto no tenía existencias suficientes, el inventario podría haber quedado modificado parcialmente aunque el pedido fuera rechazado.

Las transacciones permiten confirmar todas las operaciones mediante COMMIT o revertir los cambios mediante ROLLBACK cuando ocurre un error.

### 3. Aporte de cada integrante

Hamal — Sobre el aporte de Mariaelis:

Mariaelis contribuyó con la investigación y elaboración de las respuestas correspondientes a las preguntas 3, 5, 6, 7 y 8 del taller, relacionadas con la arquitectura de Node.js, la conexión a MySQL y las operaciones CRUD. Y tambien en otras cosas más.

Su aporte permitió complementar la documentación teórica y relacionar los conceptos estudiados con el desarrollo de TiendaAPI.

Mariaelis — Sobre el aporte de Hamal:

Hamal Hamal se encargó de la implementación técnica del proyecto, incluyendo la configuración de Node.js y MySQL, la creación de la base de datos, la programación de los endpoints y las pruebas de funcionamiento.

También colaboró en la ejecución de las pruebas, la solución de errores y la publicación de los avances del proyecto mediante GitHub.

### 4. ¿Qué nota se pondrían y cómo la justificarían?

La verdad nos pondriamos un 100 por el sacrificio de hacer este taller muy largo, Profe, muy bonito el taller, pero no lo vuelva hacer.
Consideramos que hemos desarrollado una parte importante del proyecto, implementando la conexión con MySQL, las operaciones de productos, la creación de pedidos, el control de inventario y la documentación mediante Swagger.
