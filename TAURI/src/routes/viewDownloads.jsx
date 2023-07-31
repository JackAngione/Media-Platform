
import {invoke} from "@tauri-apps/api/tauri";
import * as React from "react";
import {useEffect, useState} from "react";
import "./usersearchpage.css";
import { Player } from 'video-react';
import ReactPlayer from "react-player";
import Get_Downloaded_Files from "../get_downloaded.jsx";

export default function ViewDownloads() {
    const [uploadPaths, setUploadPaths] = useState({})
    async function getDownloadedFiles() {
        await Get_Downloaded_Files().then((pathsData) =>{
            console.log(pathsData)
            setUploadPaths(pathsData)
        }).catch(err => console.error(err))


    }
    return(
        <>
            <h1> MY DOWNLOADS</h1>

            <button onClick={getDownloadedFiles}>CXLICK</button>
            {/*loops through all the usernames*/}
            {Object.keys(uploadPaths).map((user_id, index) => (
                <div key = {"user" + index} >
                    <p key={"user-" + index}> user:{user_id}</p>
                    {uploadPaths[user_id].map((upload_id, index2) => (
                        <div key = {"div" + index2}>
                          <ReactPlayer
                              key={index2}
                              url={"../../downloaded_files/"+ user_id + "/" + upload_id + ".jack"}
                              controls={true}
                              volume={0.25}/>
                            {/*TODO MAKE A COMPONENT THAT DYNAMICALLY FIGURES OUT WHICH MEDIA TYPE audio/vidoe/picture*/}

                        </div>

                    ))}
                </div>
            ))}
        </>
    )

}