import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import PlayerCard from "./playerCard/playerCard";
import ShopCard from "./shopCard/shopCard";
import RankCard from "./rankCard/rankCard";
import LoginCard from "./loginCard/loginCard";
import "./index.css";

//const username = prompt("Enter your username");
//const password = prompt("Enter your password");
//const region = prompt("Enter your region");

const root = ReactDOM.createRoot(document.getElementsByTagName("body")[0]);
root.render(
  <React.StrictMode>
    <LoginCard />
  </React.StrictMode>
);

export default async function main(username, password, region) {
  const loginRQ = await fetch(
    "https://j9tnjmqlzd.execute-api.us-east-2.amazonaws.com/dev/api/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: username,
        pass: password,
      }),
    }
  );
  const body = await loginRQ.json();

  const token = body.token;
  const entitlement = body.entitlement;
  const puuid = body.puuid;

  const {
    item1,
    price1,
    img1,
    item2,
    price2,
    img2,
    item3,
    price3,
    img3,
    item4,
    price4,
    img4,
  } = await getStoreOffers(token, entitlement, puuid, region);

  const { vp, rp } = await getWallet(token, entitlement, puuid, region);
  const { xp, level } = await getXP(token, entitlement, puuid, region);
  const { user, tag } = await userinfo(token);
  const title = await getTitle(token, entitlement, puuid, region);
  renderSite(
    user,
    tag,
    title,
    level,
    xp,
    item1,
    img1,
    price1,
    item2,
    img2,
    price2,
    item3,
    img3,
    price3,
    item4,
    img4,
    price4
  );
}

async function userinfo(token) {
  const userRQ = await fetch(
    "https://j9tnjmqlzd.execute-api.us-east-2.amazonaws.com/dev/api/userinfo",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token,
        Cookie: "",
      }),
    }
  );
  const body = await userRQ.json();

  const user = body.user;
  const tag = body.tag;
  return { user, tag };
}

async function getStoreOffers(token, entitlement, puuid, region) {
  console.log(token, entitlement, puuid, region);

  const storeRQ = await fetch(
    "https://j9tnjmqlzd.execute-api.us-east-2.amazonaws.com/dev/api/store",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token,
        entitlement: entitlement,
        puuid: puuid,
        region: region,
      }),
    }
  );

  const body = await storeRQ.json();

  let item1 = body.offer0,
    price1 = body.offer0Cost,
    img1 = body.offer0Img;
  let item2 = body.offer1,
    price2 = body.offer1Cost,
    img2 = body.offer1Img;
  let item3 = body.offer2,
    price3 = body.offer2Cost,
    img3 = body.offer2Img;
  let item4 = body.offer3,
    price4 = body.offer3Cost,
    img4 = body.offer3Img;
  console.log(item1);
  return {
    item1,
    price1,
    img1,
    item2,
    price2,
    img2,
    item3,
    price3,
    img3,
    item4,
    price4,
    img4,
  };
}

async function getWallet(token, entitlement, puuid, region) {
  const walletRQ = await fetch(
    "https://j9tnjmqlzd.execute-api.us-east-2.amazonaws.com/dev/api/wallet",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token,
        entitlement: entitlement,
        puuid: puuid,
        region: region,
      }),
    }
  );
  const body = await walletRQ.json();

  const vp = body.vp;
  const rp = body.rp;
  return { vp, rp };
}

async function getXP(token, entitlement, puuid, region) {
  const xpRQ = await fetch(
    "https://j9tnjmqlzd.execute-api.us-east-2.amazonaws.com/dev/api/xp",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token,
        entitlement: entitlement,
        puuid: puuid,
        region: region,
      }),
    }
  );
  const body = await xpRQ.json();
  console.log(body);
  const xp = body.xp;
  const level = body.level;
  return { xp, level };
}

async function getTitle(token, entitlement, puuid, region) {
  const titleRQ = await fetch(
    "https://j9tnjmqlzd.execute-api.us-east-2.amazonaws.com/dev/api/title",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token,
        entitlement: entitlement,
        puuid: puuid,
        region: region,
      }),
    }
  );
  console.log(titleRQ);
  const body = await titleRQ.json();
  console.log(body);

  return body.title;
}

function renderSite(
  user,
  tag,
  title,
  level,
  xp,
  item1,
  img1,
  price1,
  item2,
  img2,
  price2,
  item3,
  img3,
  price3,
  item4,
  img4,
  price4
) {
  console.log(
    user,
    tag,
    title,
    level,
    xp,
    item1,
    img1,
    price1,
    item2,
    img2,
    price2,
    item3,
    img3,
    price3,
    item4,
    img4,
    price4
  );
  const root = ReactDOM.createRoot(document.getElementsByTagName("body")[0]);
  root.render(
    <React.StrictMode>
      <div className="username">
        <h2> Welcome {user} </h2>
      </div>
      <PlayerCard user={user} tag={tag} title={title} level={level} xp={xp} />
      {/* <RankCard />*/}
      <ShopCard
        item1={item1}
        img1={img1}
        price1={price1}
        item2={item2}
        img2={img2}
        price2={price2}
        item3={item3}
        img3={img3}
        price3={price3}
        item4={item4}
        img4={img4}
        price4={price4}
      />
    </React.StrictMode>
  );
}

//main(username, password, region).catch((err) => {
//console.error(err);
//});
