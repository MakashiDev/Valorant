import React from "react";

const RankCard = () => {
  const percentage = 44;
  return (
    <div className="mainDiv">
      <span>Silver 1</span>
      <div id="rankLeft">
        <div className="progressRing"> </div>
      </div>
      <div id="rankRight"></div>
    </div>
  );
};

export default RankCard;
