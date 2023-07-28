
import {invoke} from "@tauri-apps/api/tauri";
import * as React from "react";
import {useEffect, useState} from "react";
import "./usersearchpage.css";
import { Player } from 'video-react';
import ReactPlayer from "react-player";

export default function ViewDownloads() {
    const [userFolders, setUserFolders] = useState([])
    const [uploadPaths, setUploadPaths] = useState({})

    useEffect(() => {
        async function updatePaths()
        {
            if (userFolders.length > 0) {
                let tempArray = {}
                for (let username_ of userFolders) {
                    //for each username, get all the downloaded files in their folder
                    await invoke("get_user_uploads", {user_id: username_})
                        .then((uploads) => {
                            console.log("uploads: " + typeof uploads)
                            tempArray[username_] = uploads
                        })
                }
                console.log("final temp array: " + JSON.stringify(tempArray))
                setUploadPaths(tempArray);
            }
        }
       updatePaths().then(() => {})
    }, [userFolders]);
    async function getDownloadedFiles() {
        console.log("button clicked")
        await invoke("get_user_folders")
            .then(async (message) => {
                console.log("message: " + message)
                setUserFolders(message)
            })
    }
   /* if(Object.keys(uploadPaths).length === 0)
    {

        return <div><button onClick={getDownloadedFiles}>CXLICK</button>
            Loading...</div>;
    }*/
    return(
        <>
            <h1> MY DOWNLOADS</h1>

            <button onClick={getDownloadedFiles}>CXLICK</button>
            {/*loops through all of the usernames*/}
            {Object.keys(uploadPaths).map((item, index) => (
                <div key = {"user" + index} >
                    <p key={"user-" + index}> user:{item}</p>

                    {uploadPaths[item].map((item2, index2) => (
                        <div key = {"div" + index2}>
                            {console.log(item2.slice(3))}
                          <ReactPlayer
                              key={item + index2}
                              url={item2.slice(3)}
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