import {useLoaderData, useParams} from "react-router-dom";
import {invoke} from "@tauri-apps/api/tauri";
import * as React from "react";
import {useState} from "react";
import "./userpage.css";

export default function UserPage() {
    const [userName, setUserName] = useState("TEST");
    let [userIDJSON, setUserIDJSON] = useState("");
    let [usernameJSON, setUsernameJSON] = useState("");
    let theUploads;
    let [uploadsJSON, setUploadsJSON] = useState([]);

    async function getUserInfo()
    {
        let theUser;
        //GET USER INFO
        theUser = await invoke("getuser", {username: userName}).then((message) => {return message});
        //GET USER UPLOADS

        theUploads = await invoke("getuploads", {userid: userName}).then((message) => {return message});
        setUploadsJSON(JSON.parse(theUploads))

        let userJSON = JSON.parse(theUser)
        setUserIDJSON(userJSON.userID);
        setUsernameJSON(userJSON.username);
        console.log(uploadsJSON)
        console.log("UserID = " + userIDJSON)
        console.log("Username = " + usernameJSON)
    }
    async function downloadFile(videoID)
    {
        uploadDownload = await invoke("downloadfileftp", {userid: userIDJSON, videoid: videoID}).then((message) => {return message});
    }

    const {userID} = useParams()
    return(
        <>
            <h1>User: {userID}</h1>
            <input
                id="userNameInput"
                onChange={(e) => setUserName(e.currentTarget.value)}
                placeholder="username!!"
            />
            <button type="button" onClick={() => getUserInfo()}>
                View User
            </button>
            <p>{userName}</p>

            <h1>
                UserID: {userIDJSON} _ Username:{usernameJSON}
            </h1>
            <p>UPLOADS:</p>
            <ul id="uploadsList">
                {uploadsJSON.map((item, index) => (
                    <li key={index} id="list-item">

                        videoID: {item.videoID}  <h1><a id="titleLink" href="#" onClick={() => {}}>TITLE: {item.title}</a> </h1>
                        <button type="button" onClick={() => downloadFile(item.videoID)}>
                            Download
                        </button>
                    </li>
                ))}
            </ul>

        </>
    )
}