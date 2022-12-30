import React from "react";
import ProgressBar from "./progressBar";
import "./playerCard.css";

const PlayerCard = () => {
  return (
    <div className="playerCard">
      <div className="pcHeader">
        <span className="pcName">
          Makashi<span className="pcNameTag">#ΔΔΔ</span>
        </span>
        <span className="pcTitle">Mid</span>
      </div>
      <div className="pcBody">
        <span className="pcBodylevel">49</span>
        <span className="pcBodySub">800/5000</span>
        <ProgressBar />
      </div>
    </div>
  );
};

export default PlayerCard;
