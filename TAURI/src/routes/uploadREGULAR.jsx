import * as React from "react";
import { invoke } from "@tauri-apps/api/tauri";
import {useRef, useState} from "react";
import {Form, json} from "react-router-dom";
const UploadPage = () => {
    let [inputs, setInputs] = useState({})
    //let file= useRef(null);

    const CHUNK_SIZE = 100000000; // 100 MB
    const [file, setFile] = useState(null);

    const [currentChunkIndex, setCurrentChunkIndex] = useState(null)
    inputs["userid"] = ""
    inputs["videoid"] = ""
    //let [title, set_title] = useState("");
    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };
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
    };
    const handleChange = (event) =>
    {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}))
    }

    const submitUpload =  (event) => {
        event.preventDefault();
        uploadFile().then(r => console.log("done"));

        /*
        //GET CURRENT UTC DATE/TIME IN MM/DD/YYYY, HOUR:MIN:SEC FORMAT
        const now = new Date();
        const month = `0${now.getUTCMonth() + 1}`.slice(-2);
        const day = `0${now.getUTCDate()}`.slice(-2);
        const year = now.getUTCFullYear();
        const hour = `0${now.getUTCHours()}`.slice(-2);
        const minute = `0${now.getUTCMinutes()}`.slice(-2);
        const second = `0${now.getUTCSeconds()}`.slice(-2);
        const formattedDate = `${month}/${day}/${year}, ${hour}:${minute}:${second}`;
        //
        inputs["uploadDate"] = formattedDate
        inputs = JSON.stringify(inputs);
        console.log(inputs)
        */
        //let submitUpload = await invoke("uploaddatabase", {metadata: inputs}).then((message) => {return message});
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
                        value={inputs.title || ""}
                        onChange={handleChange}
                        placeholder="title"
                    />
                </label>
                <label>Enter Description:
                    <input
                        type="text"
                        name="description"
                        value={inputs.description || ""}
                        onChange={handleChange}
                        placeholder="description"
                    />
                </label>

                <input type="submit" />
            </form>
                <p>{inputs.title}{inputs.description}</p>

        </>
    );
}
export default UploadPage;
