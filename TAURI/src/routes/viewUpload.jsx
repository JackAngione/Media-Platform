import {useLocation} from "react-router";
import ReactPlayer from "react-player";
import * as React from "react";

export default function ViewUpload()
{
    let location = useLocation();
    const user_id = location.state.user_id
    const upload_id = location.state.upload_id
    return(
     <>
        <h1> View Single Upload </h1>
         {user_id}

         {upload_id}

         <div id="singleUploadPlayer">
             <ReactPlayer
                 url={"../../downloaded_files/"+ user_id + "/" + upload_id + ".jack"}
                 controls={true}
                 volume={0.25}
             />

         </div>
     </>
    )
}