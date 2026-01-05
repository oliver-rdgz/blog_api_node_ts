# Descripción
Es un blog sencillo que se implementa mediante una API RESTful que permite hacer un CRUD de POSTS.

## Tecnologías
- Node.js v22.13.1

## Iniciar sin Docker
- Se debe tener instalado PNPM
- Ejecutar el siguiente comando en la raíz del proyecto => `pnpm i`
- Se debe cambiar la conexión de BD que está en la ruta `src\database.ts` por una conexión de MongoDB activa
- Ejecutar el siguiente comando en la raíz del proyecto => `pnpm run dev`

El puerto por defecto es el 3120.

## Iniciar con Docker
Ejecutar el siguiente comando en la raíz del proyecto:
- Windows => `docker compose up`
- Linux => `sudo docker compose up`

El puerto por defecto es el 3500.

## Documentación Swagger
La ruta para ingresar a la documentación es => `/api-docs`

## Recomendaciones para las pruebas
Antes de ejecutar las pruebas se deben crear más de 1 post, para que las pruebas de integración no presenten ningún error.

Es necesario para que las pruebas puedan obtener dos IDs de la colección post de la base de datos, lo que permite realizar las pruebas de:
- Obtener detalle del post
- Actualizar un post
- Eliminar un post

En caso de usar Docker, debes tener ejecutando el contenedor de MongoDB.

## Pruebas sin Docker
Ejecutar cualquiera de los siguientes comandos en la raíz del proyecto:
- `pnpm run test`
- `pnpm jest`

## Pruebas con Docker
Ingresar a una terminal para ejecutar el siguiente comando:
- Windows => `docker exec -it blog /bin/ash`
- Linux => `sudo docker exec -it blog /bin/ash`

Dentro del contenedor de blog ejecutamos cualquiera de los siguientes comandos:
- `pnpm run test`
- `pnpm jest`

## Realizar Build
Se debe tener instalado el PNPM y las librerías del proyecto para ejecutar cualquiera de los siguientes comandos en la raíz del proyecto:
- `pnpm run build`
- `pnpm tsc`