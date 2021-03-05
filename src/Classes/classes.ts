export { Server } from "./Server";
export { ServerConfig } from "./ServerConfig";
export { DatabaseHandler } from "./DatabaseHandler";
import { User } from "./User";
export { User } from "./User";
export { Session } from "./Session";

export interface AuthResult {
    code: number,
    user: User
}