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
                code: -1,
                response: "Internal server error. Your query could not be completed."
            });
            return;
        case 200:
            const session = server.createSession(auth.user);
            res.status(200)
            .send({
                code: 3,
                response: "Login successful.",
                sesh_token: session.token
            });
            return;
        case 400:
            res.status(200).send({
                code: 0,
                response: "Bad request."
            });
            return;
        case 404:
            res.status(200).send({
                code: 1,
                response: "Unknown user."
            });
            return;
        case 401:
            res.status(200).send({
                code: 2,
                response: "Incorrect password."
            });
            return;
    }
});



// -V