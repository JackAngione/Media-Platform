import * as React from "react";
import Cookies from 'js-cookie';
import "./logout.css";
import { useNavigate } from "react-router-dom";
import {useState} from "react";
import axios from "axios";
import {serverAddress} from "../serverInfo.js";

const Logout = () => {

    const navigate = useNavigate();
    const [logoutStatus, setLogoutStatus] = useState("")
    //send logout request to server
    async function logout()
    {
        const token = Cookies.get('jwt');  // Get JWT from cookies

        //make post request
        await axios.post(serverAddress + "/api/logout", {},{headers: {
                Authorization: `Bearer ${token}`,  // Pass JWT in Authorization header
            }})
            .then(response=> {
                //TODO ONLY LOG OUT IF SERVER SENDS CORRECT STATUS

                if(response.status === 201)
                {
                    //server side successfully processed logout
                    setLogoutStatus("logging out...")
                    //remove cookie
                    Cookies.remove('jwt')
                    //redirect to log in page
                    navigate("/login");
                }
                else
                {
                    console.log("unknown logout response??")
                }
            })
            .catch(error =>{
                if(error.response.status === 401)
                {
                    //client token(login) was not valid, so force logout anyway
                    //remove cookie
                    setLogoutStatus("logging out...")
                    Cookies.remove('jwt')
                    //redirect to log in page
                    navigate("/login");
                }
                else if(error.response.status === 500)
                {
                    //server is currently unable to process the logout
                    //keep user logged in for now
                    setLogoutStatus("there was a server error logging out, please try again later.")
                }
            })
    }

    return (
        <div id="logout">
            <h1>LogOut!</h1>
            <button type="button" onClick={() => logout()}>
                Logout
            </button>
            {logoutStatus}
        </div>
    );
}
export default Logout;
