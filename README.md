# 2022-Daiot-Mongo-Node-MQTT
Repositorio con el backend de ejemplo para desplegar una aplicación IoT utilizando Mongo+Node+MQTT

Pasos a seguir luego de clonar el repositorio en nuestro equipo de desarrollo:
1) Crear una copia de las variables de entorno con el comando: cp .env.example .env
2) Instalar las dependencias ejecutando el comando: npm install
3) En la carpeta other-files se encuentra la configuración utilizada para el servidor mosquitto con TLS.. es necesario agregar los certificados en la carpeta /etc/mosquitto/certs
4) En caso de utilizar una base de datos mongo local... estar corriendo el servicio (ejecutar mongod en una consola separada).
5) Ejecutar la aplicación con el comando: npm run dev

# Descripcion del backend:
## Base de datos:
Se selecciona el motor de bases de datos MongoDb.
Se crean 2 esquemas : dispositivos y logs

## Endpoints:

### POST endpoints

* "/dispositivos/:id": recibe en el body un json que contiene {"nombre": nuevoNombre, "ubicacion": nuevaUbicacion} y permite una actualización de los parametros dentro del dispositivo y en la base de datos.
* "/leds/:id": recibe en el body un json del formato { "Led1": 1, "Led2": 0 } con informacion de la activación o no de las salidas. El backend modifica la base de datos y el dispositivo, encendiendo o no los leds.

### GET endpoints

* "/dispositivos": entrega un json con el listado de la informacion de todos los nodos de la base de datos.
* "/dispositivos/:id": entrega un json con la informacion del dispositivo seleccionado.
* "/logs/:id": consulta todas las mediciones del dispositivo a la base de datos.
* "/lastlogs/:id": obtiene la ultima medicion del dispositivo.

