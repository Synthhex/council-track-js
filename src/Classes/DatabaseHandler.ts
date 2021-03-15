import { AuthResult, Server, ServerConfig, User } from "./classes";
import * as bcrypt from "bcrypt";
import * as MySQL from "mysql";

export class DatabaseHandler {
    private server: Server;
    private sql: MySQL.Pool;

    constructor(server: Server, config: ServerConfig) {
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
    
    select(query: string, params: Array<any>) {
        return new Promise<Array<any>>(async (resolve, reject) => {
            this.sql.getConnection((err, connection) => {
                if(err) {
                    reject(err);
                    return;
                }
                connection.query(query, params, (err: MySQL.MysqlError, data: Array<any>) => {
                    connection.release();
                    if(err) {
                        connection.release();
                        reject(err);
                        return;
                    }             
                    if(!Array.isArray(data)) {
                        reject(new Error("Select function returned OkPacket."));
                        return;
                    }
                    resolve(data);
                    return;
                });
            });
        });
    }
    insert(query: string, params: Array<any>) {
        return new Promise<MySQL.OkPacket>(async (resolve, reject) => {
            this.sql.getConnection((err, connection) => {
                if(err) {
                    reject(err);
                    return;
                }
                connection.query(query, params, (err: MySQL.MysqlError, data: Array<any>) => {
                    connection.release();
                    if(err) {
                        reject(err);
                        return;
                    }        
                    if(Array.isArray(data)) {
                        reject(new Error("Insert function returned RowDataPackets."));
                        return;
                    }   
                    resolve(data);
                    return;
                });
            });
        });
    }

    authenticate(email: string, password: string) {
        return new Promise<AuthResult>(async (resolve, reject) => {
            console.log(email, password);
            let result: AuthResult = {
                code: null,
                user: null
            }

            if(email === undefined || password === undefined) {
                result.code = 400;
                resolve(result);
                return;
            }


            const query = `
                SELECT * FROM user_data WHERE email = ?
            `


            let user;
            try {
                user = await this.select(query, [email.toString()]);
            }catch(err) {
                console.log(err);
                result.code = 500;
                resolve(result);
                return;
            }

            if(!Array.isArray(user)) {
                result.code = 500;
                resolve(result);
                return;
            }
            user = user[0];

            if(!user) {
                result.code = 404;
                resolve(result);
                return;
            }

            let comparison: boolean;
            try {
                comparison = await bcrypt.compare(password, user.password);
            }catch(err) {
                console.log(err);
                result.code = 500;
                resolve(result);
                return;
            }

            if(comparison) {
                result.code = 200;
                result.user = new User(this.server, user.internal_id);
            }else{
                result.code = 401;
            }

            resolve(result);
            return;
        });
    }

    
}