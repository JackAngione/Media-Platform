import * as React from "react";
import { invoke } from "@tauri-apps/api/tauri";
import {useEffect, useRef, useState} from "react";
import {Form, json} from "react-router-dom";
import axios from "axios";
import {serverAddress} from "../serverInfo.js";
const UploadPage = () => {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [fileSize, setFileSize] = useState("")
    const [originalFilename, setOriginalFilename] = useState("")
    const [fileExt, setFileExt] = useState("")


    const CHUNK_SIZE = 100000000; // 100 MB
    const [file, setFile] = useState();

    //CONVERTS BYTES TO FORMATTED STRING SIZE
    function formatFileSize(bytes) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes === 0) return '0 Byte';
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
    }
    function getFileExtension(filename) {
        return filename.split('.').pop();
    }
    const handleFileChange = (event) => {
        const fileTemp = event.target.files[0]
        setFile(fileTemp);
        setFileSize(formatFileSize(fileTemp.size))
        setOriginalFilename(fileTemp.name)
        setFileExt(getFileExtension(fileTemp.name))
    };
    //SEND UPLOAD INFO TO UPLOAD DATABASE
    async function uploadToDatabase()
    {
        let jsonData = {
            userID: "",
            uploadID: "",
            originalFilename: originalFilename,
            fileType: fileExt,
            title: title,
            description: description,
            fileSize: fileSize,
            uploadDate: ""
        }
        axios.post(serverAddress+"/api/upload", jsonData)
            .then(function (response) {
            })
    }
    //SEND FILE BYTES TO UPLOAD SERVER
    async function uploadFile(){
        if (!file) return;

        const chunks = [];
        const fileSize = file.size;
        let start = 0;
        let end = CHUNK_SIZE;

        while (start < fileSize) {
            chunks.push(file.slice(start, end));
            start = end;
            end = start + CHUNK_SIZE;
        }

        for (let i = 0; i < chunks.length; i++)
        {
            console.log("sent " + i + " chunk")
            const chunk = chunks[i];
            const formData = new FormData();
            formData.append('chunk', chunk, file.name);
            formData.append('chunkNumber', i);
            formData.append('totalChunks', chunks.length-1);

            await fetch('http://127.0.0.1:8000/upload', {
                method: 'POST',
                body: formData,
            });
        }
        console.log('File uploaded successfully');
    }

    const submitUpload =  async (event) => {
        event.preventDefault();
        await uploadToDatabase()
        uploadFile().then(r => console.log("done"));
    }

    return(
        <>
            <input type="file" id="fileInput"onChange={handleFileChange} />
            <p></p>
            <form onSubmit={submitUpload}>
                <label>Enter Title:
                    <input
                        type="text"
                        name="title"
                        value={title || ""}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="title"
                    />
                </label>
                <label>Enter Description:
                    <input
                        type="text"
                        name="description"
                        value={description || ""}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="description"
                    />
                </label>

                <input type="submit" />
            </form>
            <p>{"title: " + title}</p>
            <p>{"Description: " + description}</p>
            <p>{"File Size: " + fileSize}</p>
            <p>{"File Extension: " + fileExt}</p>

        </>
    );
}
export default UploadPage;
