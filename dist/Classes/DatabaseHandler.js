"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseHandler = void 0;
const classes_1 = require("./classes");
const bcrypt = __importStar(require("bcrypt"));
const MySQL = __importStar(require("mysql"));
class DatabaseHandler {
    constructor(server, config) {
        this.server = server;
        this.sql = MySQL.createPool({
            connectionLimit: 1000,
            host: config.sql.host,
            user: config.sql.user,
            password: config.sql.password,
            database: config.sql.database,
            port: config.sql.port,
        });
    }
    generalQuery(query, params) {
        return new Promise(async (resolve, reject) => {
            this.sql.getConnection((err, connection) => {
                if (err) {
                    reject(err);
                    return;
                }
                connection.query(query, params, (err, data) => {
                    if (err) {
                        connection.release();
                        reject(err);
                        return;
                    }
                    connection.release();
                    resolve(data);
                    return;
                });
            });
        });
    }
    authenticate(email, password) {
        return new Promise(async (resolve, reject) => {
            console.log(email, password);
            let result = {
                code: null,
                user: null
            };
            if (email === undefined || password === undefined) {
                result.code = 400;
                resolve(result);
                return;
            }
            const query = `
                SELECT * FROM user_data WHERE email = ?
            `;
            let user;
            try {
                user = await this.generalQuery(query, [email.toString()]);
            }
            catch (err) {
                console.log(err);
                result.code = 500;
                resolve(result);
                return;
            }
            if (!Array.isArray(user)) {
                result.code = 500;
                resolve(result);
                return;
            }
            user = user[0];
            if (!user) {
                result.code = 404;
                resolve(result);
                return;
            }
            let comparison;
            try {
                comparison = await bcrypt.compare(password, user.password);
            }
            catch (err) {
                console.log(err);
                result.code = 500;
                resolve(result);
                return;
            }
            if (comparison) {
                result.code = 200;
                result.user = new classes_1.User(this.server, user.id);
            }
            else {
                result.code = 401;
            }
            resolve(result);
            return;
        });
    }
}
exports.DatabaseHandler = DatabaseHandler;
//# sourceMappingURL=DatabaseHandler.js.map