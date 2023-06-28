import * as React from "react";
import { invoke } from "@tauri-apps/api/tauri";
import "../Login.css";
import { useNavigate } from "react-router-dom";
import {useState} from "react";
import axios from "axios";
import {serverAddress} from "../serverInfo.js";

const Login = () => {
    const [loginFail, setLoginFail] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();


    async function initLogin() {
        let loginStatus;
        /*RUST LOGIN
        loginStatus = await invoke("rustlogin", {email, password}).then((message) => {return message});
        console.log(loginStatus)
         */
        let inputs = {"email": email, "password": password}
        axios.post(serverAddress + "/api/login", inputs)
            .then(response=> {
                console.log(response.data.success)
                if(response.data.success)
                {
                    console.log("successful login!!!! yayaya")
                    navigate("/homepage");
                }
                else
                {
                    console.log("LOGIN FAILED:" + response.data.success)
                    setLoginFail("Login Failed")
                }
            })
    }
    const openInNewTab = url => {
        window.open(url, '_self');
    };
    async function swapPage(){
        navigate("/homepage");
        console.log("swapped to homepage!")
    }
    return (
        <div id="container">
            <h1>JACK'S VIDEOPLATFORM!</h1>
            <button type="button" onClick={() => swapPage()}>
                Swap Pages
            </button>
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
                <p id = "loginFailCSS">{loginFail}</p>
            </div>

        </div>
    );
}
export default Login;
