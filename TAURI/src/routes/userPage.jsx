import {useLoaderData, useParams} from "react-router-dom";
import {invoke} from "@tauri-apps/api/tauri";
import * as React from "react";
import {useState} from "react";
import "./userpage.css";
import axios from "axios";
import {serverAddress} from "../serverInfo.js";

export default function UserPage(props) {
    const [searchUsername, setSearchUsername] = useState("xxxxxxx");
    let [userIDJSON, setUserIDJSON] = useState("");
    let [usernameJSON, setUsernameJSON] = useState("");
    let [uploadList, setUploadList] = useState([]);
    let [uploadsJSON, setUploadsJSON] = useState([]);

    async function getUserInfo()
    {

        setUploadsJSON(JSON.parse(uploadList))

        let userJSON = JSON.parse(searchUsername)
        setUserIDJSON(userJSON.userID);
        setUsernameJSON(userJSON.username);
        console.log(uploadsJSON)
        console.log("UserID = " + userIDJSON)
        console.log("Username = " + usernameJSON)
    }
    async function getUserUploads(videoID)
    {
        await axios.get(serverAddress + '/api/userUpoads', {
            params: {
                userID: searchUsername
            }
        }).then(function (res) {
                //console.log(JSON.stringify(res.data));
                setUploadList(res.data)
            })
    }

    //invoke rust function to download file to device
    async function downloadFile(user_id, upload_id) {
        await invoke("download_chunk", {user_id: user_id, upload_id: upload_id})
            .then((message) => {
                console.log("download Successful?!")
            })
    }

    return(
        <>
            <h1>User: {props.userID}</h1>
            <input
                id="userNameInput"
                onChange={(e) => setSearchUsername(e.currentTarget.value)}
                placeholder="username!!"
            />
            <button type="button" onClick={() => getUserUploads()}>
                View User
            </button>
            <p>{searchUsername}</p>

            <h1>
                UserID: {userIDJSON} _ Username:{usernameJSON}
            </h1>
            <p>UPLOADS:</p>
            <ul id="uploadsList">
                {uploadList.map((item, index) => (
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