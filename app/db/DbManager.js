const Sqlite = require("nativescript-sqlite");


class DbManager {
    constructor() {
        this.dbName = "CostingDB"
    }

    getDbConnection() {
        return new Sqlite(this.dbName);
    }

    executeQuery(db, sql) {
        return db.execSQL(sql);
    }

    executeParamQuery(db, sql, paramsArray) {
        for(let i = 0; i < paramsArray.length; i++) {
            sql = sql.replace(paramsArray[i].key, "'" + paramsArray[i].value + "'")
        }
        return db.execSQL(sql);
    }

    allQuery(db, sql, parameters) {
        return db.all(sql, parameters);
    }
}

module.exports = DbManager;

