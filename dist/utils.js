"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
function generateToken() {
    const pool = "abcdefghijklmnopqrstuvwxyz0123456789";
    let id = "";
    while (id.length < 36) {
        id += pool[Math.floor(Math.random() * pool.length)];
    }
    return id;
}
exports.generateToken = generateToken;
//# sourceMappingURL=utils.js.map