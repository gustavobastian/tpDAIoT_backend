// EXPRESS:
const express = require("express");
const app = express();
const errorHandler = require("errorhandler");
const helmet = require("helmet");
const Router = require("express-promise-router");
const config = require("./config");
let cors = require("cors");

const API_ENV = config.services.API;
const registerRoutes = require("./routers");
const router = Router();

// Descomentar para usar mongoDB
require('./storage/database/mongo');
// Descomentar para usar MySQL
// require("./storage/database/mysql");

//me conecto a la db.

//comment for production
let corsOptions = {
  origin: ["192.168.1.100"],
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "OPTIONS"],
};


app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//helmet
app.use(helmet.xssFilter());
app.use(helmet.noSniff());
app.use(helmet.hidePoweredBy());
app.use(helmet.frameguard({ action: "deny" }));

router.use(errorHandler());

app.use(router);
//REGISTRO DE RUTAS
registerRoutes(router);

router.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send(err.message);
});

app.listen(API_ENV.PORT, function (req, res) {
  console.log(`API Funcionando... en: http://${API_ENV.HOST}:${API_ENV.PORT}`);
});
