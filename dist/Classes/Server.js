"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const express_1 = __importDefault(require("express"));
const classes_1 = require("./classes");
class Server {
    constructor(data, callback) {
        this.sessions = [];
        this.app = express_1.default();
        this.app.use(express_1.default.json());
        this.port = data.port;
        this.callback = callback;
        this.app.listen(this.port, () => {
            this.callback();
        });
        this.DatabaseHandler = new classes_1.DatabaseHandler(this, data);
        setInterval(() => {
            this.sessionCollection();
        }, 500);
    }
    sessionCollection() {
        // Loop through the sessions backwards so deletion does not affect indices.
        for (let i = this.sessions.length - 1; i >= 0; i--) {
            const sesh = this.sessions[i];
            if (sesh.status === "inactive")
                this.sessions.splice(i, 1);
        }
    }
    createSession(user) {
        const session = new classes_1.Session(this, user);
        this.sessions.push(session);
        return session;
    }
    getApp() {
        return this.app;
    }
    getDatabaseHandler() {
        return this.DatabaseHandler;
    }
}
exports.Server = Server;
//# sourceMappingURL=Server.js.map