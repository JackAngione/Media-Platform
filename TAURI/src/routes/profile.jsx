import * as React from "react";
import {useEffect, useState} from "react";
import "./profile.css";
import axios from "axios";
import {serverAddress} from "../serverInfo.js";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import {Link, useNavigate} from "react-router-dom";

export default function Profile() {
    const [user_id, setUser_id] = useState("");
    const [userProfile, setUserProfile] = useState({})
    const [userUpoads, setUserUploads] = useState()
    const navigate = useNavigate()
    //when current user id is retrieved, get the profile information from server
    useEffect(() => {
        if(user_id !== "")
        {
            //get profile information
            axios.get(serverAddress + `/api/user/${user_id}`, {
                params: {
                    userID: user_id
                }
            }).then(function (res) {
                //console.log(JSON.stringify(res.data));
                setUserProfile(res.data)
            })
        }
    }, [user_id]);
    // on page load, get logged in user id from jwt cookie
    useEffect( () => {
        if(user_id === "")
        {
            try {
                const token = Cookies.get('jwt');  // Get JWT from cookies
                setUser_id(jwtDecode(token).user_id)
            } catch (e) {
                console.log("cannot retrieve jwt, not signed in")
            }
        }
    },[]);
    function ProfileData()
    {
        if(userProfile === {})
        {
            return (<><h1>Profile not loaded</h1></>)
        }
        else
        {
            return (
                <>
                    <h1>User: {userProfile.profile?.username}</h1>
                    <h1>Email: {userProfile.profile?.email}</h1>
                    <h1>Creation Date: {userProfile.profile?.creationDate}</h1>
                </>
            )
        }
    }

    function downloadFile(userID, uploadID) {

    }

    return (
            <>
                <button onClick={()=>{navigate("/account_settings")}}>
                    Account Settings
                </button>
                <ProfileData/>


                <p>UPLOADS:</p>
                <ul id="uploadsList">
                    {userProfile.uploads?.map((item, index) => (
                        <li key={index} id="list-item">

                            videoID: {item.uploadID}  <h1><a id="titleLink" href="#" onClick={() => {}}>TITLE: {item.title}</a> </h1>
                            <button type="button" onClick={() => downloadFile(item.userID, item.uploadID)}>
                                Download
                            </button>
                        </li>
                    ))}
                </ul>
            </>
        )
    }