import {Link, useNavigate} from "react-router-dom";
import * as React from "react";
import axios from "axios";
import {serverAddress} from "../serverInfo.js";
import Cookies from "js-cookie";
import "./editAccount.css"
import {useEffect, useState} from "react";
import jwtDecode from "jwt-decode";
export default function EditAccount()
{
    let [user_id, setUser_id] = useState("")
    let [editFail, setEditFail] = useState("")

    let [newUsername, setNewUsername] = useState("")
    let [newEmail, setNewEmail] = useState("")

    let [oldPassword, setOldPassword] = useState("")
    let [newPassword, setNewPassword] = useState("")
    let [repeatNewPassword, setRepeatNewPassword] = useState("")




    let [oldUserInfo, setOldUserInfo] = useState({})
    let navigate = useNavigate()

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

                setOldUserInfo(res.data)
            })
        }
    }, [user_id]);
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
    function editsChecker()
    {
        console.log("in edit checker")
        //if all fields are empty, there is nothing to update
        if(newEmail === "" && newUsername === "" && oldPassword === "" && newPassword === "" && repeatNewPassword === "")
        {
            setEditFail("There is nothing to save...")
            return false
        }
        //if any of the password fields are filled in
        else if(oldPassword !== "" || newPassword !== "" || repeatNewPassword !== "")
        {
            //then user is trying to change password
            if(oldPassword === "")
            {
                //old password needs to be entered
                setEditFail("to change password, old password must be provided")
                return false
            }
            else if(newPassword==="" || repeatNewPassword ==="")
            {
                setEditFail("a new password and repeated new password must be entered to change password")
                return false
            }

            //PASSWORDS DO NOT MATCH
            if(newPassword !== repeatNewPassword)
            {
                setEditFail("new passwords do not match")
                return false
            }
        }
        setEditFail("")
        return true
    }
    async function saveChanges() {
        let readyToSend = editsChecker()
        if (readyToSend) {
            let token= ""
            //send to
            try {
                token = Cookies.get('jwt');  // Get JWT from cookies
            } catch (e) {
                console.log("cannot retrieve jwt, not signed in")
                navigate("/")
            }


            //ONLY SEND INFORMATION THAT NEEDS TO BE UPDATE
            //LIKE IF EMAIL ISN'T GOING TO BE CHANGED, DON'T SEND EMAIL DATA TO SERVER
            let newProfileInfo = {}
            if(newUsername !=="")
            {
                newProfileInfo.username = newUsername
            }
            if(newEmail !=="")
            {
                newProfileInfo.email = newEmail
            }
            if(newPassword !=="")
            {
                newProfileInfo.password = newPassword
                newProfileInfo.old_password = oldPassword
            }
            //send new info to server
            await axios.post(serverAddress + "/api/editAccount", newProfileInfo, {
                headers: {
                    authorization: `Bearer ${token}`,  // Pass JWT in Authorization header
                }
            })
                .then(response=> {
                    if(response.status === 200)
                    {
                      navigate("/my_profile")
                    }

                }).catch(error =>{
                    if(error.response.status === 400)
                    {
                        setEditFail("old password is incorrect")
                    }
                    else if(error.response.status === 500)
                    {
                        console.log("LOGIN FAILED:")
                        setEditFail("error updating database")
                    }
                    else if(error.response.status=== 401)
                    {
                        setEditFail("current login token is invalid, please log out and log in again")
                    }
                })
        }


    }
    return(
        <div className="editAccountPage">
            <div className="editInputs">
                <label htmlFor="name">Change Username:</label>
                <input
                    type="text"
                    onChange={(e) => setNewUsername(e.currentTarget.value)}
                    placeholder={oldUserInfo.profile?.username}
                />

                <label htmlFor="name">Change Email:</label>
                <input
                    type="text"
                    onChange={(e) => setNewEmail(e.currentTarget.value)}
                    placeholder={oldUserInfo.profile?.email}
                />

            </div>

            <div className="editPassword">
                <label htmlFor="name">Old Password:</label>
                <input
                    type="text"
                    onChange={(e) => setOldPassword(e.currentTarget.value)}
                />
                <label htmlFor="name">New Password:</label>
                <input
                    type="text"
                    onChange={(e) => setNewPassword(e.currentTarget.value)}
                />
                <label htmlFor="name"> Repeat New Password:</label>
                <input
                    type="text"
                    onChange={(e) => setRepeatNewPassword(e.currentTarget.value)}
                />

            </div>

            <div className="editFailText">
                {editFail}
            </div>

            <div id="editAccountSubmitButtons">

                <button onClick={()=>{saveChanges()}}>
                    Save Changes
                </button>
                <button onClick={()=>{navigate("/my_profile")}}>
                    Cancel
                </button>
            </div>


        </div>
    )
}