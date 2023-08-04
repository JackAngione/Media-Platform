import {useParams} from "react-router";
import * as React from "react";
import {useEffect, useState} from "react";
import {invoke} from "@tauri-apps/api/tauri";
import axios from "axios";
import {serverAddress} from "../serverInfo.js";
import Get_Downloaded_Files from "../get_downloaded.jsx";
import {useNavigate} from "react-router-dom";

export default function UserPage(props)
{
    let [userProfile, setUserProfile] = useState("");
    const navigate = useNavigate()
    const {user_id} = useParams()

    const [uploadPaths, setUploadPaths] = useState({})
    useEffect(() => {
        async function getDownloadedFiles() {
            await Get_Downloaded_Files().then((pathsData) =>{
                console.log(pathsData)
                setUploadPaths(pathsData)
            }).catch(err => console.error(err))
        }
        getDownloadedFiles().then(r => {})
    }, []);
    useEffect(() => {
           getUserInfo().then(r => {})
    }, []);
    async function getUserInfo()
    {
        //get profile information
        axios.get(serverAddress + `/api/user/${user_id}`, {
            params: {
                user_id: user_id
            }
        }).then(function (res) {
            //console.log(JSON.stringify(res.data));
            setUserProfile(res.data)
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
            <h1>
                user_id: {user_id} _ Username:{userProfile.profile?.username}
            </h1>
            <p>UPLOADS:</p>
            <ul id="uploadsList">
                {userProfile.uploads?.map((item, index) => (
                    <li key={index} id="list-item">

                        videoID: {item.uploadID}
                        <h1><a id="titleLink" href="#" onClick={() => {}}>TITLE: {item.title}</a> </h1>

                        {//CODE to display a download vs view button for an upload
                        }
                        {
                            uploadPaths[user_id].includes(item.uploadID) ? (<button
                                    onClick={()=> {
                                        navigate("/viewUpload", {state:{user_id:user_id, upload_id: item.uploadID}})
                                    }}>View</button>) :
                                (<button
                                    type="button"
                                    onClick={() => downloadFile(item.user_id, item.uploadID)}
                                >
                                    Download
                                </button>)
                        }
                    </li>
                ))}
            </ul>
        </>
    )
}