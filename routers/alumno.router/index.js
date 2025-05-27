const dispositivo = require("../prueba.router/models/dispositivos");
const logs = require("../prueba.router/models/logs");
const clientMqtt = require("../../storage/mqtt");
const options = clientMqtt.MQTTOptions;


const register = (router) => {
  router.get("/status", (req, resp) => resp.json({ status: 200 }));

  //Turn on and off leds
  //body with json data : {"Led1":0,"Led2":0}

  router.post("/leds/:id", async function(req, res){
    let deviceId=req.params.id;   
    const payload = JSON.stringify(req.body);
    clientMqtt.publish("/topic/"+deviceId+"/parametros", payload, options, (error) => {
    if (error) {
        console.log(error);
    }
    })    
    res.send("Modifico Leds").status(200);
  });

  //Modify sensor parameters
  //body with json data : {"nombre":"nombre","ubicacion":"ubicacion"}

  router.post("/dispositivos/:id", async function(req, res){
    let deviceId=req.params.id;

    const payload = JSON.stringify(req.body);
    clientMqtt.publish("/topic/"+deviceId+"/parametros", payload, options, (error) => {
    if (error) {
        console.log(error);
    }
    })    

    //alter database

    //const listado = await dispositivo.findOne({ "dispositivoId": req.params.id });
    //console.log(listado);
       //ACTUALIZO Dispositivo EN MONGO
       await dispositivo.findOneAndUpdate(
        { "dispositivoId": req.params.id },
        {
            nombre: req.body.nombre,
            ubicacion: req.body.ubicacion,            
        }).then(book => {
            console.log("DISPOSITIVO ACTUALIZADO.");
        }).catch(err => {
            console.log("ERROR UPDATING");
        });




    res.send("Modifico Parametros").status(200);
  });
  
  //get logs from db
  router.get("/logs", async function(req, res){
    const listado = await logs.find();
    if (!listado) return res.json({ data: null, error: 'No hay datos en la Base de Datos.' });
    if (listado) return res.send( listado);
  });

  //get individual logs from the db
    router.get("/logs/:id", async function(req, res){
	
  //sorted from late to first    
    const listado = await logs.find({ "nodoId": req.params.id }).sort({ts:-1});
    console.log("aqui")      
    if (!listado) return res.json({ data: null, error: 'No hay datos en la Base de Datos.' });
    if (listado) return res.send( listado);
  });

  //get  last individual logs from the db
  router.get("/lastlogs/:id", async function(req, res){
	
    //sorted from late to first    
      const listado = await logs.find({ "nodoId": req.params.id }).sort({ts:-1}).limit(1);
      console.log("aqui")        
      if (!listado) return res.json({ data: null, error: 'No hay datos en la Base de Datos.' });
      if (listado) return res.send( listado);
    });

  //get dispositivos
  router.get('/dispositivos', async function (req, res) {
    //    console.log("recibo get")
        const listado = await dispositivo.find();
        if (!listado) return res.json({ data: null, error: 'No hay datos en la Base de Datos.' });
        if (listado) return res.send(listado);
    });
  
  //get dispositivos
  router.get('/dispositivos/status/:id', async function (req, res) {
    //get dispositivos
  router.get('/dispositivos', async function (req, res) {
    //    console.log("recibo get")
        const listado = await dispositivo.find();
        if (!listado) return res.json({ data: null, error: 'No hay datos en la Base de Datos.' });
        if (listado) return res.send(listado);
    });
    });  

  return router;
};

module.exports = {
  register,
};
