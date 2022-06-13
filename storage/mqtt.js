var mqtt = require('mqtt');
const config = require("./../config");

const MQTT_ENV = config.services.MQTT;

var options = {
    clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
    rejectUnauthorized: true,
    username: MQTT_ENV.USERNAME,
    password: MQTT_ENV.PASSWORD,
    qos: 2,
    port: MQTT_ENV.PORT,
    clean: true
}

const URI = `mqtt://${MQTT_ENV.HOST}`;
console.log("MQTT:" + URI);
const client = mqtt.connect(URI, options);

var arrayTopicsListen = [];
var arrayTopicsServer = [];
// connected
client.on('connect', function () {
    console.log("[MQTT] Init: Connected");
});
//handle errors
client.on("error", function (error) {
    console.log("[MQTT] Error: OCURRIÓ UN PROBLEMA: " + error);
});

client.MQTTOptions = options;
module.exports = client;