# Bitácora de desarrollo — TiendaAPI

**Materia:** INF 323 — Programación Web IV
**Taller:** TiendaAPI con Node.js, Express y MySQL

## 18 de octubre de 2026

### Paso 1 — Preparación del entorno
**Hamal:** Por completar con el integrante que realizó el trabajo.

**Actividades:**
- Verificamos Node.js v22.16.0 y npm 10.9.2.
- Comprobamos la instalación de Git y su configuración.
- Iniciamos Apache y MySQL desde XAMPP.
- Verificamos el acceso a phpMyAdmin.
- Comprobamos las extensiones Thunder Client y YAML en VS Code.

**Resultado:** Herramientas necesarias funcionando.

### Paso 2 — Creación de la base de datos
**Hamal:** Por completar con el integrante que realizó el trabajo.

**Actividades:**
- Creamos la base de datos tienda.
- Creamos las tablas categorias, productos, pedidos y pedido_items.
- Registramos tres categorías y diez productos.
- Creamos los usuarios tienda_app para localhost y 127.0.0.1.
- Asignamos permisos SELECT, INSERT y UPDATE.

**Problema resuelto:** phpMyAdmin mostró el error #1046 porque la base de datos no estaba seleccionada. Se solucionó seleccionando tienda en el panel izquierdo.

**Resultado:** Base de datos preparada correctamente.

## 19 de octubre de 2026

### Paso 3 — Respuestas del taller
**Hamal:** Por completar.

**Actividades:**
- Preparamos respuestas técnicas para las preguntas del taller.
- Identificamos preguntas que requieren contrastarse con el video del instructor.
- Guardamos las respuestas propuestas en docs/respuestas.md.

**Pendiente:** Verificar los detalles específicos del video y completar la autoevaluación.

### Paso 4 — Creación del proyecto Node.js (en desarrollo)
**Hamal:** Por completar.

**Actividades:**
- Creamos la carpeta tiendaapi en Documentos.
- Inicializamos el proyecto con npm init -y.
- Instalamos express, mysql2, dotenv y nodemon.
- Configuramos los scripts dev y start en package.json.
- Creamos db/esquema.sql.
- Creamos docs/respuestas.md y docs/bitacora.md.

**Problemas encontrados:**
- npm audit detectó tres vulnerabilidades de gravedad alta relacionadas con dependencias de nodemon. La corrección automática sin --force no las resolvió; sigue pendiente revisarlas.
- La carpeta docs se creó inicialmente dentro de db. Se corrigió moviéndola a la raíz del proyecto.

**Resultado:** Estructura inicial del proyecto en preparación.

## Próximos pasos que haremos
- Completar los archivos de configuración y conexión a MySQL.
- Ejecutar la ruta /api/salud.
- Configurar GitHub con la participación de ambos integrantes.
- Implementar los endpoints de productos y pedidos.
- Documentar y probar la API.


