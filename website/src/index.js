import React from "react";
import ReactDOM from "react-dom/client";
import PlayerCard from "./playerCard/playerCard";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementsByTagName("body")[0]);
root.render(
  <React.StrictMode>
    <div class="username">
      <h2>Welcome Makashi</h2>
    </div>
    <PlayerCard />
  </React.StrictMode>
);
