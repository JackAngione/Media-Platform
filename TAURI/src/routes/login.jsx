import * as React from "react";
import Cookies from 'js-cookie';
import "./Login.css";
import { useNavigate } from "react-router-dom";
import {useState} from "react";
import axios from "axios";
import {serverAddress} from "../serverInfo.js";

const Login = () => {
    const [loginFail, setLoginFail] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    //send login credentials to the server to get back JWT
    async function initLogin() {

        let inputs = {"email": email, "password": password}
        //make post request
        axios.post(serverAddress + "/api/login", inputs)
            .then(response=> {
                if(response.status !== 401)
                {
                    console.log("successful login!!!! yayaya")
                    const token = response.data.token; // Ensure your server sends the JWT as "token" in the response body

                    // Save JWT to cookies, you can set the number of days until the JWT will expire
                    Cookies.set('jwt', token, { expires: 7 }); // The JWT will expire after 7 days
                    navigate("/");
                }
                else
                {
                    console.log("LOGIN FAILED:")
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
