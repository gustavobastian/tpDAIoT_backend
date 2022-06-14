var mqtt = require('mqtt');
var fs = require('fs');
const config = require("./../config");

const MQTT_ENV = config.services.MQTT;

var caFile = fs.readFileSync("ca.crt");
var certFile = fs.readFileSync("client.crt");
var keyFile = fs.readFileSync("client.key");

var options = {
    clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
    rejectUnauthorized: false,//true
    //username: MQTT_ENV.USERNAME,
    //password: MQTT_ENV.PASSWORD,
    ca: [ caFile ],
    cert: certFile,
    key: keyFile,
    qos: 2,
    port: MQTT_ENV.PORT,
    clean: true
}

const URI = `mqtts://${MQTT_ENV.HOST}`;//mqtt
console.log("MQTTS:" + URI);
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