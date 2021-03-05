"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = void 0;
const utils_1 = require("../utils");
class Session {
    constructor(server, user) {
        this.server = server;
        this.token = utils_1.generateToken();
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
exports.Session = Session;
//# sourceMappingURL=Session.js.map