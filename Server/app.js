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

app.post("/api/login", async (req, res) => {
  let user = req.body.user;
  let pass = req.body.pass;
  var authCookies = await axios.post(
    "https://auth.riotgames.com/api/v1/authorization",
    {
      client_id: "play-valorant-web-prod",
      nonce: 1,
      redirect_uri: "https://playvalorant.com/opt_in",
      response_type: "token id_token",
      scope: "account openid",
    },
    {
      headers: {
        "Content-Type": "application/json",
        "user-agent":
          "RiotClient/63.0.5.4887690.4789131 rso-auth (Windows;10;;Professional, x64)",
      },
      httpsAgent: agent,
    }
  );

  var loginCookies = await axios.put(
    "https://auth.riotgames.com/api/v1/authorization",
    {
      type: "auth",
      username: user,
      password: pass,
      remember: true,
      language: "en_US",
    },
    {
      headers: {
        "Content-Type": "application/json",
        "user-agent":
          "RiotClient/63.0.5.4887690.4789131 rso-auth (Windows;10;;Professional, x64)",
        Cookie: authCookies.headers["set-cookie"],
      },
      httpsAgent: agent,
    }
  );
  if (loginCookies.data.type !== "multifactor") {
    var uri = loginCookies.data.response.parameters.uri;
    var querydata = url.parse(uri, true).hash.split("&");
    var token = querydata[0].replace("#access_token=", "");
    //Above is how the acces token is extracted from the url
    var entitlement = await axios.post(
      "https://entitlements.auth.riotgames.com/api/token/v1",
      {},
      {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "user-agent":
            "RiotClient/63.0.5.4887690.4789131 rso-auth (Windows;10;;Professional, x64)",
        },
      }
    );
    var puuid = await axios.get("https://auth.riotgames.com/userinfo", {
      headers: {
        "user-agent":
          "RiotClient/63.0.5.4887690.4789131 rso-auth (Windows;10;;Professional, x64)",
        Authorization: "Bearer " + token,
      },
    });
    res.send({
      token: token,
      entitlement: entitlement.data.entitlements_token,
      puuid: puuid.data.sub,
      reAuth: loginCookies.headers["set-cookie"],
    });
  } else {
    res.send({
      err: "auth",
      Cookie: loginCookies.headers["set-cookie"],
    });
  }
});

app.post("/api/auth", async (req, res) => {
  let mfacode = req.body.code;
  let cookies = req.body.Cookie;

  var mfa = await axios.put(
    "https://auth.riotgames.com/api/v1/authorization",
    {
      type: "multifactor",
      code: mfacode,
      rememberDevice: true,
    },
    {
      headers: {
        "Content-Type": "application/json",
        "user-agent":
          "RiotClient/63.0.5.4887690.4789131 rso-auth (Windows;10;;Professional, x64)",
        Cookie: cookies,
      },
      httpsAgent: agent,
    }
  );

  var uri = mfa.data.response.parameters.uri;
  var querydata = url.parse(uri, true).hash.split("&");
  var acces_token = querydata[0].replace("#access_token=", "");
  var entitlementtoken = await axios.post(
    "https://entitlements.auth.riotgames.com/api/token/v1",
    {},
    {
      headers: {
        Authorization: "Bearer " + acces_token,
        "user-agent":
          "RiotClient/63.0.5.4887690.4789131 rso-auth (Windows;10;;Professional, x64)",
        "Content-Type": "application/json",
      },
    }
  );
  var puuidtoken = await axios.get("https://auth.riotgames.com/userinfo", {
    headers: {
      Authorization: "Bearer " + acces_token,
    },
  });

  res.send({
    token: acces_token,
    entitlement: entitlementtoken.data.entitlements_token,
    puuid: puuidtoken.data.sub,
  });
});

app.post("/api/reauth", async (req, res) => {
  var reauthCookies = req.body.reauthCookies;
  var reauth = await axios.get(
    "https://auth.riotgames.com/authorize?redirect_uri=https%3A%2F%2Fplayvalorant.com%2Fopt_in&client_id=play-valorant-web-prod&response_type=token%20id_token&nonce=1",
    {
      headers: {
        "user-agent": "",
        Cookie: reauthCookies,
      },
      httpsAgent: agent,
    }
  );
  console.log(reauth.status);
});

app.post("/api/store", async (req, res) => {
  var token = req.body.token;
  var entitlement = req.body.entitlement;
  var puuid = req.body.puuid;
  var region = req.body.region;

  var store = await axios.get(
    "https://pd." + region + ".a.pvp.net/store/v2/storefront/" + puuid,
    {
      headers: {
        "X-Riot-Entitlements-JWT": entitlement,
        Authorization: "Bearer " + token,
      },
    }
  );
  const vp = "85ad13f7-3d1b-5128-9eb2-7cd8ee0b5741";

  const offer0 = store.data.SkinsPanelLayout.SingleItemStoreOffers[0].OfferID;
  const offer0Cost =
    store.data.SkinsPanelLayout.SingleItemStoreOffers[0].Cost[vp];
  const offer1 = store.data.SkinsPanelLayout.SingleItemStoreOffers[1].OfferID;
  const offer1Cost =
    store.data.SkinsPanelLayout.SingleItemStoreOffers[1].Cost[vp];
  const offer2 = store.data.SkinsPanelLayout.SingleItemStoreOffers[2].OfferID;
  const offer2Cost =
    store.data.SkinsPanelLayout.SingleItemStoreOffers[2].Cost[vp];
  const offer3 = store.data.SkinsPanelLayout.SingleItemStoreOffers[3].OfferID;
  const offer3Cost =
    store.data.SkinsPanelLayout.SingleItemStoreOffers[3].Cost[vp];

  const offer0Img =
    "https://media.valorant-api.com/weaponskinlevels/" +
    offer0 +
    "/displayicon.png";
  const offer1Img =
    "https://media.valorant-api.com/weaponskinlevels/" +
    offer1 +
    "/displayicon.png";
  const offer2Img =
    "https://media.valorant-api.com/weaponskinlevels/" +
    offer2 +
    "/displayicon.png";
  const offer3Img =
    "https://media.valorant-api.com/weaponskinlevels/" +
    offer3 +
    "/displayicon.png";

  res.send({
    offer0: offer0,
    offer0Cost: offer0Cost,
    offer0Img: offer0Img,
    offer1: offer1,
    offer1Cost: offer1Cost,
    offer1Img: offer1Img,
    offer2: offer2,
    offer2Cost: offer2Cost,
    offer2Img: offer2Img,
    offer3: offer3,
    offer3Cost: offer3Cost,
    offer3Img: offer3Img,
  });
});

app.post("/api/wallet", async (req, res) => {
  var token = req.body.token;
  var entitlement = req.body.entitlement;
  var puuid = req.body.puuid;
  var region = req.body.region;

  var wallet = await axios.get(
    "https://pd." + region + ".a.pvp.net/store/v1/wallet/" + puuid,
    {
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

app.post("/api/xp", async (req, res) => {
  var token = req.body.token;
  var entitlement = req.body.entitlement;
  var puuid = req.body.puuid;
  var region = req.body.region;

  var accountXP = await axios.get(
    "https://pd." + region + ".a.pvp.net/account-xp/v1/players/" + puuid,
    {
      headers: {
        "X-Riot-Entitlements-JWT": entitlement,
        "user-agent":
          "RiotClient/63.0.5.4887690.4789131 rso-auth (Windows;10;;Professional, x64)",
        Authorization: "Bearer " + token,
      },
    }
  );
  res.send({
    xp: accountXP.data.Progress.XP,
    level: accountXP.data.Progress.Level,
  });
});

app.post("/api/userinfo", async (req, res) => {
  var token = req.body.token;

  var userinfo = await axios.get("https://auth.riotgames.com/userinfo", {
    headers: {
      "user-agent":
        "RiotClient/63.0.5.4887690.4789131 rso-auth (Windows;10;;Professional, x64)",
      Authorization: "Bearer " + token,
    },
  });
  const user = userinfo.data.acct.game_name;
  const tag = userinfo.data.acct.tag_line;

  res.send({
    user: user,
    tag: tag,
  });
});

app.post("/api/title", async (req, res) => {
  var token = req.body.token;
  var entitlement = req.body.entitlement;
  var puuid = req.body.puuid;
  var region = req.body.region;

  var title = await axios.get(
    "https://pd." +
      region +
      ".a.pvp.net/personalization/v2/players/" +
      puuid +
      "/playerloadout",
    {
      headers: {
        "X-Riot-Entitlements-JWT": entitlement,
        "user-agent":
          "RiotClient/63.0.5.4887690.4789131 rso-auth (Windows;10;;Professional, x64)",
        Authorization: "Bearer " + token,
      },
    }
  );
  var titleText = await axios.get(
    "https://valorant-api.com/v1/playertitles/" +
      title.data.Identity.PlayerTitleID,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (titleText.data.data.titleText === "None") {
    res.send({ title: " " });
  }
  res.send({ title: titleText.data.data.titleText });
});

app.listen(3000, () => console.log(`Listening on: 3000`));
//module.exports.handler = serverless(app);
