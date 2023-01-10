import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";

function App() {
  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function initLogin() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setLogin(await invoke("login", {email, password}));
  }

  return (
    <div id="container">
      <h1>JACK'S VIDEOPLATFORM!</h1>

      <div id="loginDiv">
          <input
            id="email-login"
            onChange={(e) => setEmail(e.currentTarget.value)}
            placeholder="Email"
          />
          <input
            id="password-login"
            onChange={(e) => setPassword(e.currentTarget.value)}
            placeholder="Password"
          />
          <button type="button" onClick={() => initLogin()}>
            Login
          </button>
      </div>

      <p>{login}</p>
    </div>
  );
}
export default App;
