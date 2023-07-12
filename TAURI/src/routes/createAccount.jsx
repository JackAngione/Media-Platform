import * as React from "react";
import {useState} from "react";
import "./createAccount.css"
import axios from "axios";
import {serverAddress} from "../serverInfo.js";
import Cookies from "js-cookie";
import {useNavigate} from "react-router-dom";

function CreateAccount()
{
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")

    const [passwordShown, setPasswordShown] = useState(false);
    const [password, setPassword] = useState("")
    //TODO make errorText an array so that you can text and add/remove errors and they all show up at once
    let [errorText, setErrorText] = useState("")
    const navigate = useNavigate();
    async function createAccount() {
        if(password.length <= 6)
        {
            setErrorText("password must be longer than 6 characters")
            return
        }
        if(username.includes(" ") || password.includes(" "))
        {
            setErrorText("username and password cannot have spaces")
            return
        }
        let jsonData = {"email": email, "password": password, "username": username}
        //make post request

        axios.post(serverAddress + "/api/createAccount", jsonData)
            .then(response=> {
                if (response.status === 201) {

                    console.log("create account good")
                    navigate("/");
                }
            })
            .catch((reason) => {
                if(reason.response.status === 409)
                {
                    console.log("create account failed")
                    setErrorText("email already in use")
                }
        })
    }
    const togglePasswordVisibility = () => {
        setPasswordShown(!passwordShown);
    };
    return(
        <>
            <div id="createAccountDiv">
                <input
                    id="email"
                    onChange={(e) => setEmail(e.currentTarget.value)}
                    placeholder="Email"
                />
                <input
                    id="username"
                    onChange={(e) => setUsername(e.currentTarget.value)}
                    placeholder="Username"
                />
                <div>
                    <input
                        id="password"
                        type={passwordShown ? "text" : "password"}
                        onChange={(e) => setPassword(e.currentTarget.value)}
                        placeholder="Password"
                    />
                    <button onClick={togglePasswordVisibility}>
                        {passwordShown ? "Hide" : "Show"}
                    </button>
                </div>

                <button type="button" onClick={() => createAccount()}>
                    Create Account
                </button>
                <p id="errorText"> {errorText}</p>
            </div>
        </>
    );
}
export default CreateAccount;
