import React from "react";

const pgPercent = "21%";

const pgContainerStyle = {
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

const ProgressBar = () => {
  return (
    <div className="pgContainer" style={pgContainerStyle}>
      <div className="pg" style={pgStyle}></div>
    </div>
  );
};

export default ProgressBar;
