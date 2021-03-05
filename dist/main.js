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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const classes_1 = require("./Classes/classes");
const config = __importStar(require("./config.json"));
const path_1 = __importDefault(require("path"));
const server = new classes_1.Server(config, function () {
    console.log(`CouncilTrack server is online. Listening on port ${config.port}`);
});
const app = server.getApp();
app.get("/", function (req, res) {
    res.sendFile(path_1.default.resolve(__dirname + "/../HTML/login.html"));
    return;
});
app.post("/login", async function (req, res) {
    const auth = await server.getDatabaseHandler().authenticate(req.body.email, req.body.password);
    switch (auth.code) {
        case 500:
            res.status(500).send({
                response: "INTERNAL_ERROR"
            });
            return;
        case 200:
            const session = server.createSession(auth.user);
            res.status(200)
                .send({
                response: "LOGIN_SUCCESSFUL",
                sesh_token: session.token
            });
            return;
        case 400:
            res.status(200).send({
                response: "BAD_REQUEST"
            });
            return;
        case 404:
            res.status(200).send({
                response: "USER_NOT_FOUND"
            });
            return;
        case 401:
            res.status(200).send({
                response: "INCORRECT_PASSWORD"
            });
            return;
    }
});
//# sourceMappingURL=main.js.map