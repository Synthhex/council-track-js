import express, { Application } from "express";
import bodyParser from "body-parser";
import { ServerConfig, DatabaseHandler, Session, User } from "./classes";

export class Server {
    private app: Application;
    private port: number;
    private callback: Function;

    private DatabaseHandler: DatabaseHandler;
    
    private sessions: Array<Session> = [];
    constructor(data: ServerConfig, callback: Function) {
        this.app = express();
        this.app.use(express.json());
        this.port = data.port;
        this.callback = callback;

        this.app.listen(this.port, () => {
            this.callback();
        });

        this.DatabaseHandler = new DatabaseHandler(this, data);
        
        setInterval(() => {
            this.sessionCollection();
        }, 500);
    }

    sessionCollection() {
        // Loop through the sessions backwards so deletion does not affect indices.
        for(let i = this.sessions.length - 1; i >= 0; i--) {
            const sesh: Session = this.sessions[i];
            if(sesh.status === "inactive") this.sessions.splice(i, 1);
        }
    }

    createSession(user: User) {
        this.disconnectUser(user);
        const session = new Session(this, user);
        this.sessions.push(session);
        return session;
    }

    disconnectUser(user: User) {
        let num = 0;
        for(const sesh of this.sessions) {
            if(sesh.user.getID() === user.getID()) {
                sesh.close();
                num++
            }
        }
        return num;
    }

    getApp() {
        return this.app;
    }
    getDatabaseHandler() {
        return this.DatabaseHandler;
    }
}