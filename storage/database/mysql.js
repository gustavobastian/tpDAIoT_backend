const mysql = require("mysql");
const config = require("./../../config");
const DB_ENV = config.services.DATABASE.MYSQL;
const dbConfig = {
    host: DB_ENV.HOST,
    user: DB_ENV.USERNAME,
    password: DB_ENV.PASSWORD,
    database: DB_ENV.DBNAME,
    port: DB_ENV.PORT
};

let connection;

function handleConnection() {
    connection = mysql.createConnection(dbConfig);
    connection.connect((err) => {
        if (err) {
            console.error("[db-error]", err);
            setTimeout(handleConnection, 2000);
        } else console.log("DB CONNECTED");
    });

    connection.on("error", (err) => {
        console.error("[db-error]", err);
        if (err.code === "PROTOCOL_CONNECTION_LOST") {
            handleConnection();
        } else {
            throw err;
        }
    });
}

handleConnection();

function list(table) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM ${table}`, (error, data) => {
            if (error) return reject(error);
            resolve(data);
        });
    });
}

function get(table, id) {
    return new Promise((resolve, reject) => {
        connection.query(
            `SELECT * FROM ${table} WHERE id='${id}'`,
            (error, data) => {
                if (error) return reject(error);
                resolve(data);
            }
        );
    });
}

function insert(table, data) {
    return new Promise((resolve, reject) => {
        connection.query(`INSERT INTO ${table} SET ?`, data, (error, result) => {
            if (error) return reject(error);
            resolve(result);
        });
    });
}

function update(table, data) {
    return new Promise((resolve, reject) => {
        connection.query(
            `UPDATE ${table} SET ? WHERE id=?`,
            [data, data.id],
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
    });
}

function upsert(table, data) {
    if (data && data.id) return update(table, data);
    return insert(table, data);
}

function query(table, query, join = null) {
    return new Promise((resolve, reject) => {
        let joinQuery = "";

        if (join) {
            const key = Object.keys(join)[0];
            const val = join[key];
            joinQuery = `JOIN ${key} ON ${table}.${val} = ${key}.id`;
        }

        const sql = connection.query(
            `SELECT * FROM ${table} ${joinQuery} WHERE ?`,
            query,
            (error, result) => {
                if (error) return reject(error);
                console.log(result);
                resolve(JSON.parse(JSON.stringify(result[0] || {})) || null);
            }
        );
        console.log("Sql", sql.sql)
    });
}


const createDocument = (model, params) => {
    return new model({ ...params }).save()

}

module.exports = {
    list,
    get,
    upsert,
    query,
};