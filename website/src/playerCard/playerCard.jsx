import React from "react";
import ProgressBar from "./progressBar";
import "./playerCard.css";
const PlayerCard = (data) => {
  return (
    <div className="mainDiv" id="playerCard">
      <div className="pcHeader">
        <span className="pcName">
          {data.user}
          <span className="pcNameTag">{"#" + data.tag} </span>
        </span>
        <span className="pcTitle"> {data.title} </span>
      </div>
      <div className="pcBody">
        <span className="pcBodylevel"> {data.level} </span>
        <span className="pcBodySub"> {data.xp + "/ 5000"} </span>
        <ProgressBar xp={data.xp} />
      </div>
    </div>
  );
};

export default PlayerCard;
