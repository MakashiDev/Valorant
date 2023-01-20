import React from "react";
import ReactDOM from "react-dom/client";
import PlayerCard from "./playerCard/playerCard";
import ShopCard from "./shopCard/shopCard";
import RankCard from "./rankCard/rankCard";
import "./index.css";

const user = "Makashi";
const tag = "ΔΔΔ";
const title = "Mid";
const level = "50";
const xp = "2000";
const item1 = "Prism Ares";
const img1 =
  "https://media.valorant-api.com/weaponskinlevels/29be6d9e-48b2-1229-4f7d-4da1c20deda9/displayicon.png";
const price1 = "1275";
const item2 = "Prime Odin";
const img2 =
  "https://media.valorant-api.com/weaponskinlevels/ef564ec3-497c-3038-543e-eb94bbe46437/displayicon.png";
const price2 = "750";
const item3 = "Silvanus Operator";
const img3 =
  "https://media.valorant-api.com/weaponskinlevels/49b00063-4a7e-6c73-b8c9-68a8d5727757/displayicon.png";
const price3 = "1550";
const item4 = "Tethered Realms Guardian";
const img4 =
  "https://media.valorant-api.com/weaponskinlevels/f202625e-4647-b575-07a9-3fbc39d72b10/displayicon.png";
const price4 = "2200";

const root = ReactDOM.createRoot(document.getElementsByTagName("body")[0]);
root.render(
  <React.StrictMode>
    <div className="username">
      <h2>Welcome {user}</h2>
    </div>
    <PlayerCard user={user} tag={tag} title={title} level={level} xp={xp} />
    <RankCard />
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
