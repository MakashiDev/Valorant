import React, { useState } from "react";
import main from "../index.js";
import "./loginCard.css";

const LoginCard = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [region, setRegion] = useState("na");

  function handleUsernameChange(event) {
    setUsername(event.target.value);
  }
  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }
  function handleRegionChange(event) {
    setRegion(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    console.log(region);
    main(username, password, region).catch((err) => {
      console.log(err);
    });
  }

  return (
    <React.StrictMode>
      <div className="mainDiv" id="loginCard">
        <p> Login </p>
        <form onSubmit={handleSubmit}>
          <div className="inputBox">
            <input
              type="text"
              name=""
              value={username}
              onChange={handleUsernameChange}
              required=" "
            />
            <label>Username</label>
          </div>
          <div className="inputBox">
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              required=" "
            />
            <label>Password</label>
          </div>
          <label htmlfor="region" id="regionLabel">
            Region
          </label>
          <select
            name="region"
            id="region"
            value={region}
            onChange={handleRegionChange}
          >
            <option value="na"> North America </option>
            <option value="latam"> Latin America </option>
            <option value="br"> Brazil </option>
            <option value="eu"> Europe </option>
            <option value="ap"> Asia Pacific </option>
            <option value="kr"> Korea </option>
          </select>
          <br />
          <div style={{ textAlign: "center" }}>
            <input type="submit" value="Login" className="login" />
          </div>
        </form>
      </div>
    </React.StrictMode>
  );
};
export default LoginCard;
