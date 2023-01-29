import * as React from "react";
import { invoke } from "@tauri-apps/api/tauri";
import {useRef, useState} from "react";
import {json} from "react-router-dom";

const UploadPage = () => {
    //let [title, set_title] = useState("");
    //let [description, setdescription] = useState("");
    let [inputs, setInputs] = useState({})
    let file= useRef(null);
    inputs["userid"] = ""
    inputs["videoid"] = ""
    //let [title, set_title] = useState("");
    const handleFileChange = (event) => {
        file = (event.target.files[0]);
        console.log(file);
        inputs["ogFileName"] = file.name;
        inputs["filetype"] = file.type;
        inputs["filesize"] = file.size.toString();
        console.log(inputs)
        const fileUrl = URL.createObjectURL(file);
        console.log(fileUrl);
    }
    const handleChange = (event) =>
    {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}))
    }

    const submitUpload = async (event) => {
        event.preventDefault();
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
        let submitUpload = await invoke("uploaddatabase", {metadata: inputs}).then((message) => {
            return message
        });
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
