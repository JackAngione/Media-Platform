import * as React from "react";
import { invoke } from "@tauri-apps/api/tauri";
import "../Login.css";
import { useNavigate } from "react-router-dom";
import {useState} from "react";

const Login = () => {
    const [loginFail, setLoginFail] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();


    async function initLogin() {
        let loginStatus;
        // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
        loginStatus = await invoke("rustlogin", {email, password}).then((message) => {return message});
        console.log(loginStatus)
        if(loginStatus)
        {
            console.log("successful login!!!! yayaya")
            navigate("/homepage");
        }
        else
        {
            console.log("LOGIN FAILED!")


        }
        setLoginFail("Login Failed")
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
