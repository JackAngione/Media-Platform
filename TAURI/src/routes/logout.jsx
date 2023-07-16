import * as React from "react";
import Cookies from 'js-cookie';
import "./logout.css";
import { useNavigate } from "react-router-dom";
import {useState} from "react";
import axios from "axios";
import {serverAddress} from "../serverInfo.js";

const Logout = () => {

    const navigate = useNavigate();

    //send logout request to server
    async function logout()
    {
        const token = Cookies.get('jwt');  // Get JWT from cookies

        //make post request
        await axios.post(serverAddress + "/api/logout", {},{headers: {
                Authorization: `Bearer ${token}`,  // Pass JWT in Authorization header
            }})
            .then(response=> {
                //remove cookie
                Cookies.remove('jwt')
                //redirect to log in page
                navigate("/login");

            })
    }

    return (
        <div id="logout">
            <h1>LogOut!</h1>
            <button type="button" onClick={() => logout()}>
                Logout
            </button>

        </div>
    );
}
export default Logout;
