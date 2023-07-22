import {invoke} from "@tauri-apps/api/tauri";
import * as React from "react";
import {useEffect, useState} from "react";
import "./userpage.css";
import axios from "axios";
import {serverAddress} from "../serverInfo.js";
import { InstantSearch, SearchBox, Hits, Highlight } from 'react-instantsearch-dom';
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
export default function UserPage(props) {
    const [searchUsername, setSearchUsername] = useState("xxxxxxx");
    let [userIDJSON, setUserIDJSON] = useState("");
    let [usernameJSON, setUsernameJSON] = useState("");
    let [uploadList, setUploadList] = useState([]);
    let [uploadsJSON, setUploadsJSON] = useState([]);
    //loads the instant search client using the default search api key
    const searchClient = instantMeiliSearch(
        'http://localhost:7700',
        "eca530cb3cc8304a7c8140e50355e13ddfffb26d018b2bb1e8c2c52f35c97083",
        {placeholderSearch: false}
    );
    //when the currently selected user is changed, load their uploads
    useEffect( () => {
        getUserUploads().then(r => {})
    },[searchUsername]);
    const Hit = ({ hit }) => {
        //hit is basically a json object of the document
        //when clicking on a username in the search box, it sets the searchusername to the userid of the user you clicked
        return(
        <>
            <button onClick={()=>{
                setSearchUsername(hit.user_id)
            }}>
                <Highlight attribute="username" hit={hit}/>
            </button>
        </>
            )
    };

    async function getUserInfo()
    {
        setUploadsJSON(JSON.parse(uploadList))

        let userJSON = JSON.parse(searchUsername)
        setUserIDJSON(userJSON.user_id);
        setUsernameJSON(userJSON.username);
        console.log(uploadsJSON)
        console.log("user_id = " + userIDJSON)
        console.log("Username = " + usernameJSON)
    }
    async function getUserUploads()
    {
        await axios.get(serverAddress + '/api/userUpoads', {
            params: {
                user_id: searchUsername
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
            <h1>User: {searchUsername}</h1>
            <div className = "searchResults">
                <InstantSearch
                   indexName="users"
                   searchClient={searchClient}
                >
                    <SearchBox/>
                    <Hits hitComponent={Hit} />
                </InstantSearch>
            </div>
            
            <h1>
                user_id: {userIDJSON} _ Username:{usernameJSON}
            </h1>
            <p>UPLOADS:</p>
            <ul id="uploadsList">
                {uploadList.map((item, index) => (
                    <li key={index} id="list-item">

                        videoID: {item.uploadID}  <h1><a id="titleLink" href="#" onClick={() => {}}>TITLE: {item.title}</a> </h1>
                        <button type="button" onClick={() => downloadFile(item.user_id, item.uploadID)}>
                            Download
                        </button>
                    </li>
                ))}
            </ul>

        </>
    )
}