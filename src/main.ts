import { Server } from "./Classes/classes";
import * as config from "./config.json";
import path from "path";

const server = new Server(config, function() {
    console.log(`CouncilTrack server is online. Listening on port ${config.port}`)
});

const app = server.getApp();

app.get("/", function(req, res) {
    res.sendFile(path.resolve(__dirname + "/../HTML/login.html"));
    return;
});

app.post("/login", async function(req, res) {
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
