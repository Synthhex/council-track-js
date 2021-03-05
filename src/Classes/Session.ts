import { Server, User } from "./classes";
import { generateToken } from "../utils";

export class Session {
    private server: Server;
    public token: string;
    public status: string;
    public user: User;

    public expire_note: string;
    
    constructor(server: Server, user: User) {
        this.server = server;
        this.token = generateToken();
        this.status = "active";
        this.user = user;
    }
    close() {
        this.status = "inactive";
        return this;
    }
    setExpireNote(expire_note) {
        this.expire_note = expire_note;
        return this;
    }
}