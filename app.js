const serverless = require("serverless-http");
const express = require("express");
const app = express();
const axios = require("axios");
const { Agent } = require("https");
const url = require("url");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const agent = new Agent({
    ciphers: [
        "TLS_CHACHA20_POLY1305_SHA256",
        "TLS_AES_128_GCM_SHA256",
        "TLS_AES_256_GCM_SHA384",
        "TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256",
    ].join(":"),
    honorCipherOrder: true,
    minVersion: "TLSv1.2",
});

app.get("/api/info", (req, res) => {
    res.send({ application: "sample-app", version: "1" });
});
app.post("/api/v1/getback", (req, res) => {
    res.send({...req.body });
});

app.post("/api/login", async(req, res) => {
    let user = req.body.user;
    let pass = req.body.pass;
    var cookies0 = await axios.post(
        "https://auth.riotgames.com/api/v1/authorization", {
            client_id: "play-valorant-web-prod",
            nonce: 1,
            redirect_uri: "https://playvalorant.com/opt_in",
            response_type: "token id_token",
        }, {
            headers: {
                "Content-Type": "application/json",
            },
            httpsAgent: agent,
        }
    );

    //console.log(cookies.data);
    //console.log(user, pass);
    var cookies1 = await axios.put(
        "https://auth.riotgames.com/api/v1/authorization", {
            type: "auth",
            username: user,
            password: pass,
            remember: true,
            language: "en_US",
        }, {
            headers: {
                "Content-Type": "application/json",
                Cookie: cookies0.headers["set-cookie"],
            },
            httpsAgent: agent,
        }
    );

    //console.log(cookies1.data);
    //res.send(cookies1.data);
    if (cookies1.data.type !== "multifactor") {
        var uri = (cookies1 = cookies1.data.response.parameters.uri);
        var querydata = url.parse(uri, true).hash.split("&");
        var acces_token = querydata[0].replace("#acces_token=", "");

        res.send({ data0: cookies0.data, token: acces_token });
    } else {
        res.send({ err: "auth" });
    }

    //console.log(cookies1.data);
    //res.send({ data0: cookies0.data, data1: cookies1.data });
});

app.listen(3000, () => console.log(`Listening on: 3000`));
//module.exports.handler = serverless(app);