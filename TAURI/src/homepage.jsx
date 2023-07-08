import * as React from "react";
import ReactPlayer from 'react-player'
import "./homepage.css";
import axios from "axios";
import Cookies from 'js-cookie';
import {useState} from "react";
import {serverAddress} from "./serverInfo.js";

const Homepage = () => {
    const [tokenValid, setTokenValid] = useState("false")
        async function validateToken() {
            try {
                const token = Cookies.get('jwt');  // Get JWT from cookies
                const response = await axios.get(serverAddress+'/api/validate', {
                    headers: {
                        Authorization: `Bearer ${token}`,  // Pass JWT in Authorization header
                    }
                });
                if(response.data.isValid)
                {
                    setTokenValid("true")
                }
                return response.data.isValid;
            }
            catch (error)
            {
                console.error(error);
            }
        }

    return (
        <>
            <div id="homepage">
                <h1>HomePage</h1>
                <ReactPlayer url="https://youtu.be/E7sP6t1QyrI" controls/>
            </div>
            <input
                id="userNameInput"
                onChange={(e) => setUserName(e.currentTarget.value)}
                placeholder="username!!"
            />
            <button onClick={validateToken}> {tokenValid} </button>


        </>
    );
}
export default Homepage;