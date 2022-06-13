//conexion
class Mysql {

    //CREATE, UPDATE, DELETE, READ
    username;
    constructor(username) {
        this.username = username;
    }

    list(table) {
        const query = `SELECT * FROM ${username}${table}`;
        return query;
    }

    findById(id) {
        const query = `SELECT * FROM ${username}${table} WHERE id=${id} `;
        return query;
    }

    delete(id) {
        const query = `DELETE FROM ${username}${table} WHERE id=${id}`;
        return query;
    }
    update() { }
}


export default mysql; 
