import React, { useState, useEffect } from "react";
const ProgressBar = (xp) => {
  const [pgPercent, setPgPercent] = useState("0%");

  let pgContainerStyle = {
    position: "relative",
    width: "85%",
    padding: "3.5px",
    borderRadius: "4px",
    boxSizing: "border-box",
    background: "#ffffff1f",
  };

  const pgStyle = {
    position: "relative",
    width: pgPercent,
    height: "5px",
    background: "#0000004a",
    boxShadow: "inset 0 0 5px rgb(0 0 0 / 20%)",
    borderRadius: "4px",
    overflow: "hidden",
    transition: "width 1.5s cubic-bezier(0.86, -0.07, 0, 0.44)",
  };

  useEffect(() => {
    setPgPercent(Math.floor(xp.xp / 50) + "%");
  }, [xp.xp]);

  return (
    <div className="pgContainer" style={pgContainerStyle}>
      <div className="pg" style={pgStyle}>
        {" "}
      </div>{" "}
    </div>
  );
};

export default ProgressBar;
