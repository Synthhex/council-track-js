import { Server } from "./classes";

export class User {
    private server: Server;
    private id: string;

    constructor(server: Server, id: string) {
        this.server = server;
        this.id = id;
    }
    getID() {
        return this.id;
    }
}