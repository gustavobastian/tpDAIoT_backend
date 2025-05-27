const dispositivo = require("./models/dispositivos");
const logs = require("./models/logs");
const clientMqtt = require("../../storage/mqtt");
const { json } = require("express");
const options = clientMqtt.MQTTOptions;
let arrayTopicsListen = ["#"];
let arrayTopicsServer = ["/casa/", "/exterior/"];


clientMqtt.on("connect", async function () {
    //BUSCO TODOS LOS NODOS NO REPETIDOS
    const buscarAllnodos = await dispositivo.find().distinct("nodoId");
    for (let nodo in buscarAllnodos) {
        arrayTopicsListen.push(buscarAllnodos[nodo].topic);
        arrayTopicsServer.push(buscarAllnodos[nodo].topicSrvResponse);
    }
    
    clientMqtt.subscribe(arrayTopicsListen, options, () => {
        console.log("Subscribed to topics: ");
        console.log(arrayTopicsListen);
    });    
    clientMqtt.on("message", async (topic, payload) => {
        console.log("[MQTT] Mensaje recibido: " + topic + ": " + payload.toString());
        let mensaje = payload.toString();
        let arr=topic.split("/");
        console.log("nodo:"+arr[2]);
       
        if(arr[3]==="status"){ 
                //need to alter status in database
                
                console.log(mensaje.length);
                if(mensaje.length>19){
                 console.log("status offline");
                await dispositivo.findOneAndUpdate(
                    { "dispositivoId": arr[2]},
                    {
                        status: "Offline",
                        
                    }).then(book => {
                        console.log("DISPOSITIVO ACTUALIZADO.");
                    }).catch(err => {
                        console.log("ERROR UPDATING");
                    });
                    }
                else{
                    await dispositivo.findOneAndUpdate(
                        { "dispositivoId": arr[2]},
                        {
                            status: "Online",
                            
                        }).then(book => {
                            console.log("DISPOSITIVO ACTUALIZADO.");
                        }).catch(err => {
                            console.log("ERROR UPDATING");
                        });

                }    
                return;
            }
        else{ 
            const jason = JSON.parse(mensaje);
            if((jason.status=="Online")||(jason.status=="Offline")){
                console.log("mensaje status");
                if(json.status=="Offline"){
                    console.log("change status in database");
                    console.log(topic);
            /*     */

                }            
                return;}
            else if(mensaje.length<5){console.log("mensaje parametros");return}
            else{
            // console.log("size:"+mensaje.length);
            // busco de nombre de dispositivo en la DB
            const buscarDispositivo = await dispositivo.findOne({            
                dispositivoId: jason.dispositivoId,
            });
            
            if (buscarDispositivo) { // Si el dispositivo existe agrego un log             
                let eltime = new Date().getTime();
                let elnodo = buscarDispositivo.dispositivoId;
                
                const id = await logs.find().sort({ "logId": -1 }).limit(1); // para obtener el maximo
                
                const elLog = new logs({
                    logId: (id?.find(x => x?.logId)?.logId) || 0 + 1,
                    ts: eltime,
                    eluz1: buscarDispositivo.luz1,
                    eluz2: buscarDispositivo.luz2,
                    etemperatura: buscarDispositivo.temperatura,
                    ehumedad: buscarDispositivo.humedad,
                    nodoId: buscarDispositivo.dispositivoId
                });
                
                try {
                    const savedLog = await elLog.save();
                    console.log("REGISTRO DE LOG AGREGADO CORRECTAMENTE.");
                } catch (error) {
                    console.log("ERROR UPDATING:"+ error);
                }
                //ACTUALIZO Dispositivo EN MONGO
                await dispositivo.findOneAndUpdate(
                    { dispositivoId: buscarDispositivo.dispositivoId },
                    {
                        luz1: jason.luz1,
                        luz2: jason.luz2,
                        temperatura: jason.temperatura,
                        humedad: jason.humedad,                    
                    }).then(book => {
                        console.log("DISPOSITIVO ACTUALIZADO.");
                    }).catch(err => {
                        console.log("ERROR UPDATING");
                    });
            } else { // Si no existe creo un nuevo dispositivo
                console.log("Nodo no registrarlo, procedo a crearlo.");
                console.log("Topic recibido: " + topic);
                console.log("Datos del nodo: ");
                console.log(jason);
                // agrego un nuevo nodo en mongo
                const nuevodisp = new dispositivo({
                    dispositivoId: jason.dispositivoId,
                    nombre: jason.nombre,
                    ubicacion: jason.ubicacion,
                    luz1: jason.luz1,
                    luz2: jason.luz2,
                    temperatura: jason.temperatura,
                    humedad: jason.humedad,
                    topic: topic,
                    topicSrvResponse: topic,
                    status:"Online",
                });
                
                try {
                    await nuevodisp.save();
                    console.log("NUEVO NODO AGREGADO CORRECTAMENTE.");
                } catch (error) {
                    console.log("ERROR UPDATING :" + error);
                }
                // Agrego el log del nodo creado
                let eltime = new Date().getTime();
                let elnodo = jason.dispositivoId;
            
                const id = await logs.find().sort({ "logId": -1 }).limit(1); // para obtener el maximo
                //console.log("[LOG] id: " + id);
                const elLog = new logs({
                    logId: (id?.find(x => x?.logId)?.logId) || 0 + 1,
                    ts: eltime,
                    eluz1: jason.luz1,
                    eluz2: jason.luz2,
                    etemperatura: jason.temperatura,
                    ehumedad: jason.humedad,
                    nodoId: jason.dispositivoId
                });
            
                try {
                    await elLog.save();
                    console.log("REGISTRO DE LOG AGREGADO CORRECTAMENTE.");
                } catch (error) {
                    console.log("ERROR UPDATING: " + error);
                }
            }
        }
        }
    })

})

const register = (router) => {
    router.get("/status", (req, resp) => resp.json({ status: 200 }));

  
    router.get('/dispositivos/:id', async function (req, res) {      
        const listado = await dispositivo.findOne({ "dispositivoId": req.params.id });
        if (!listado) return res.json({ data: null, error: 'No hay datos en la Base de Datos.' });
        if (listado) return res.send(listado);
    });

    return router;
};

module.exports = {
    register,
};
