const serverless = require("serverless-http");
const express = require("express");
const app = express();
const axios = require("axios");
const { Agent } = require("https");
const url = require("url");
const { stringify } = require("querystring");
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
                "user-agent": "RiotClient/60.0.10.4802528.4749685 rso-auth (Windows;10;;Professional, x64)",
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
                "user-agent": "RiotClient/60.0.10.4802528.4749685 rso-auth (Windows;10;;Professional, x64)",
            },
            httpsAgent: agent,
        }
    );
    if (cookies1.data.type !== "multifactor") {
        var uri = cookies1.data.response.parameters.uri;
        var querydata = url.parse(uri, true).hash.split("&");
        var acces_token = querydata[0].replace("#access_token=", "");
        var entitlementtoken = await axios.post(
            "https://entitlements.auth.riotgames.com/api/token/v1", {}, {
                headers: {
                    Authorization: "Bearer " + acces_token,
                    "Content-Type": "application/json",
                    "user-agent": "RiotClient/60.0.10.4802528.4749685 rso-auth (Windows;10;;Professional, x64)",
                },
            }
        );
        var puuidtoken = await axios.get("https://auth.riotgames.com/userinfo", {
            headers: {
                Authorization: "Bearer " + acces_token,
                "user-agent": "RiotClient/60.0.10.4802528.4749685 rso-auth (Windows;10;;Professional, x64)",
            },
        });

        res.send({
            token: acces_token,
            entitlement: entitlementtoken.data.entitlements_token,
            puuid: puuidtoken.data.sub,
        });
    } else {
        res.send({
            err: "auth",
            Cookie: cookies1.headers["set-cookie"],
        });
    }

    //console.log(cookies1.data);
    //res.send({ data0: cookies0.data, data1: cookies1.data });
});

app.post("/api/auth", async(req, res) => {
    let mfacode = req.body.code;
    let cookies = req.body.Cookie;

    var mfa = await axios.put(
        "https://auth.riotgames.com/api/v1/authorization", {
            type: "multifactor",
            code: mfacode,
            rememberDevice: true,
        }, {
            headers: {
                "Content-Type": "application/json",
                Cookie: cookies,
                "user-agent": "RiotClient/60.0.10.4802528.4749685 rso-auth (Windows;10;;Professional, x64)",
            },
            httpsAgent: agent,
        }
    );

    //res.send(mfa.data);
    var uri = mfa.data.response.parameters.uri;
    var querydata = url.parse(uri, true).hash.split("&");
    var acces_token = querydata[0].replace("#access_token=", "");
    var entitlementtoken = await axios.post(
        "https://entitlements.auth.riotgames.com/api/token/v1", {}, {
            headers: {
                Authorization: "Bearer " + acces_token,
                "Content-Type": "application/json",
                "user-agent": "RiotClient/60.0.10.4802528.4749685 rso-auth (Windows;10;;Professional, x64)",
            },
        }
    );
    var puuidtoken = await axios.get("https://auth.riotgames.com/userinfo", {
        headers: {
            Authorization: "Bearer " + acces_token,
            "user-agent": "RiotClient/60.0.10.4802528.4749685 rso-auth (Windows;10;;Professional, x64)",
        },
    });

    res.send({
        token: acces_token,
        entitlement: entitlementtoken.data.entitlements_token,
        puuid: puuidtoken.data.sub,
    });
});

app.get("/api/store", async(req, res) => {
    var token = req.body.token;
    var entitlement = req.body.entitlement;
    var puuid = req.body.puuid;
    var region = req.body.region;

    var store = await axios.get(
        "https://pd." + region + ".a.pvp.net/store/v2/storefront/" + puuid, {
            headers: {
                "X-Riot-Entitlements-JWT": entitlement,
                Authorization: "Bearer " + token,
            },
        }
    );
    res.send(store.data.SkinsPanelLayout.SingleItemOffers);
});

app.get("/api/wallet", async(req, res) => {
    var token = req.body.token;
    var entitlement = req.body.entitlement;
    var puuid = req.body.puuid;
    var region = req.body.region;

    var wallet = await axios.get(
        "https://pd." + region + ".a.pvp.net/store/v1/wallet/" + puuid, {
            headers: {
                "X-Riot-Entitlements-JWT": entitlement,
                Authorization: "Bearer " + token,
            },
        }
    );
    res.send({
        vp: wallet.data.Balances["85ad13f7-3d1b-5128-9eb2-7cd8ee0b5741"],
        rp: wallet.data.Balances["e59aa87c-4cbf-517a-5983-6e81511be9b7"],
    });
});

app.get("/api/xp", async(req, res) => {
    var token = req.body.token;
    var entitlement = req.body.entitlement;
    var puuid = req.body.puuid;
    var region = req.body.region;

    var accountXP = await axios.get(
        "https://pd." + region + ".a.pvp.net/account-xp/v1/players/" + puuid, {
            headers: {
                "X-Riot-Entitlements-JWT": entitlement,
                Authorization: "Bearer " + token,
            },
        }
    );
    res.send({
        xp: accountXP.data.Progress.XP,
        level: accountXP.data.Progress.Level,
    });
});

app.get("/api/");

app.listen(3000, () => console.log(`Listening on: 3000`));
//module.exports.handler = serverless(app);