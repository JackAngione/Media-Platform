import * as React from "react";
import { invoke } from "@tauri-apps/api/tauri";
import {useRef, useState, useEffect} from "react";
import {Form, json} from "react-router-dom";
import axios from "axios";
const UploadPage = () => {
    let [inputs, setInputs] = useState({})
    //let file= useRef(null);

    const chunkSize = 10_000_000;
    const [file, setFile] = useState();
    //let file= useRef(null);
    const [currentChunk, setcurrentChunk] = useState();
    //const [lastUploadedFileIndex, setLastUploadedFileIndex] = useState(null)
    const [currentChunkIndex, setCurrentChunkIndex] = useState(null)
    inputs["userid"] = ""
    inputs["videoid"] = ""
    //let [title, set_title] = useState("");
    function readAndUploadCurrentChunk()
    {
        console.log("CURRENT CHUNK INDEX inside upload: " + currentChunkIndex)
        if(file == null)
        {
            return
        }
        const reader = new FileReader();
        //const file = files[currentFileIndex];

        const from = currentChunkIndex * chunkSize;
        const to = from + chunkSize;
        const blob = file.slice(from, to);
        console.log("UPLOADING CHUNKS")
        reader.readAsArrayBuffer(blob);
        reader.onload = e => uploadChunk(e)
    }
    function uploadChunk(readerEvent) {
        //const file = files[currentFileIndex];
        console.log("inside uploadchunk")
        let fileByteArray = [];
        const data = readerEvent.target.result;
        let array = new Uint8Array(data);
        //console.log(array)
        const numbersString = array.join(',');
        //console.log(numbersString)

        let submitUpload = invoke("sendfile", {filedata: numbersString}).then((message) => {console.log(message)});
        setCurrentChunkIndex(currentChunkIndex+1)
        //console.log("done sending")
    }
    useEffect(()=>{
        if(currentChunkIndex!== null)
        {
            readAndUploadCurrentChunk()
        }

    }, [currentChunkIndex])
    const handleFileChange = (event) => {
        //setFile([...files, ...event.target.files])
        setFile(event.target.files[0]);
        console.log(file);

        //inputs["ogFileName"] = file.name;
        //inputs["filetype"] = file.type;
        //inputs["filesize"] = file.size.toString();
        console.log(inputs)
    }
    const handleChange = (event) =>
    {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}))
    }

    const submitUpload =  (event) => {
        event.preventDefault();
        //console.log(file)
        setCurrentChunkIndex(0)
        console.log("CURRENT CHUNK INDEX: " + currentChunkIndex)
/*
        while(currentChunkIndex <=Math.ceil(file.size / chunkSize)-1 && currentChunkIndex!=null)
        {
            readAndUploadCurrentChunk()
            setCurrentChunkIndex(currentChunkIndex+1)
        }*/

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
