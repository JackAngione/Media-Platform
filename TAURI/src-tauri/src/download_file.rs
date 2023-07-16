use std::collections::HashMap;

use futures::StreamExt;
use std::fs::{create_dir_all, OpenOptions};
use std::io::Write;
use std::path::Path;

use serde::Deserialize;
use serde::Serialize;
#[derive(Serialize, Deserialize, Debug)]
struct ChunkInfo {
    total_chunks: i32,
    chunk_data: String,
}
#[tauri::command(rename_all = "snake_case")]
pub async fn download_chunk(user_id: String, upload_id: String) {
    //create path for file to download to
    let path_string = format!("../downloaded_files/{}/{}.jack", user_id, upload_id);
    let download_path = Path::new(&path_string);

    let total_chunks = get_chunk_count(&user_id, &upload_id).await;
    let mut current_chunk = 0;
    println!("total chunks: {}", total_chunks);
    let client = reqwest::Client::new();
    let mut map = HashMap::new();
    map.insert("userID", user_id.clone());
    map.insert("uploadID", upload_id.clone());

    map.insert("needed_chunk", current_chunk.to_string());
    if let Some(parent) = download_path.parent() {
        if !parent.exists() {
            std::fs::create_dir_all(parent).unwrap();
        }
    }
  /*  //if path doesn't exist, create it
    if !download_path.exists() {
        println!("creating path!");
        create_dir_all(download_path).expect("error creating nonexistent download path");
    }
*/
    let mut file = OpenOptions::new()
        .write(true)
        .create(true)
        .append(true)
        .open(download_path) // Replace with your file path
        .unwrap();

    //request the next chunk until all chunks have been requested
    while current_chunk <= total_chunks {
        println!("requesting chunk: {}", map["needed_chunk"]);
        let res = client
            .post("http://127.0.0.1:8000/download")
            .json(&map)
            .send()
            .await
            .unwrap();
        println!("getting response");
        let mut stream = res.bytes_stream();
        while let Some(item) = stream.next().await {
            let chunk = item;
            println!("writing file");
            file.write_all(&chunk.unwrap()).expect("couldn't save data");
        }
        //let json_data: ChunkInfo = serde_json::from_str(&json_string).unwrap();

        current_chunk += 1;
        map.insert("needed_chunk", current_chunk.to_string());
    }
}

//WRITE A FUNCTION THAT ONLY SENDS A GET REQUEST TO GET THE TOTAL AMOUNT OF CHUNKS NEEDED TO DOWNLOAD A FILE
async fn get_chunk_count(userID: &str, uploadID: &str) -> i32 {
    //initialize http client
    let client = reqwest::Client::new();

    //using hashmap to create json format, recommended by reqwest documentation
    let mut map = HashMap::new();
    map.insert("userID", userID);
    map.insert("uploadID", uploadID);

    //send post request
    let res = client
        .post("http://127.0.0.1:8000/getChunkCount")
        //json that is being sent to the server
        .json(&map)
        .send()
        .await
        .unwrap();
    //json response from the server
    let json_data = res.json::<ChunkInfo>().await.unwrap();
    //println!("{}", json_data.total_chunks);
    return json_data.total_chunks;
}
