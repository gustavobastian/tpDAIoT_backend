const mongoose = require("mongoose");
const config = require("./../../config");
const DB_ENV = config.services.DATABASE.MONGO;

const db_srv = DB_ENV.HOST !== "localhost" ? "+srv" : "";
const port = DB_ENV.PORT ? `:${DB_ENV.PORT}` : "";
const uri = `mongodb${db_srv}://${DB_ENV.USERNAME}:${DB_ENV.PASSWORD}@${DB_ENV.HOST}${port}/${DB_ENV.DBNAME}?retryWrites=true&w=majority`;
const db = mongoose.connection;
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    //useCreateIndex: true,
    useUnifiedTopology: true,
    //useFindAndModify: true,
  })
  .then(() => {
    const publicUri = `mongodb${db_srv}://${DB_ENV.USERNAME}:###@${DB_ENV.HOST}${port}/${DB_ENV.DBNAME}?retryWrites=true&w=majority`;
    console.log("DATABASE IS CONNECTED TO", publicUri);
  })
  .catch((err) => console.log(err));

db.on("error", (err) => {
  console.log(err);
});
