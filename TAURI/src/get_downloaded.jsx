import {invoke} from "@tauri-apps/api/tauri";


export default async function Get_Downloaded_Files() {
    let returnList
    await invoke("get_user_folders")
        .then(async (userFolders) => {
            console.log("users message: " + userFolders)
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
            returnList = tempArray
        })
    //returns list of all user and their upload_ids that are downloaded
    return returnList
}