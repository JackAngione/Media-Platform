use std::collections::HashMap;

use std::fs::OpenOptions;
use std::io::Write;
use futures::StreamExt;


use serde::Serialize;
use serde::Deserialize;
#[derive(Serialize, Deserialize, Debug)]
struct ChunkInfo {
    total_chunks: i32,
    chunk_data: String
}
#[tauri::command(rename_all = "snake_case")]
pub async fn download_chunk(user_id: String, upload_id: String)
{
    let total_chunks = get_chunk_count().await;
    let mut current_chunk = 0;
    println!("total chunks: {}", total_chunks);
    let client = reqwest::Client::new();
    let mut map = HashMap::new();
    map.insert("userID", user_id.clone());
    map.insert("uploadID", upload_id.clone());

    map.insert("needed_chunk", current_chunk.to_string());
    let mut file = OpenOptions::new()
        .write(true)
        .create(true)
        .append(true)
        .open(format!("../../{}/uploads/{}", user_id, upload_id)) // Replace with your file path
        .unwrap();

    //request the next chunk until all chunks have been requested
    while current_chunk<=total_chunks {
        println!("requesting chunk: {}", map["needed_chunk"]);
        let res = client.post("http://127.0.0.1:8000/download")
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
async fn get_chunk_count() -> i32
{
    //initialize http client
    let client = reqwest::Client::new();

    //using hashmap to create json format, recommended by reqwest documentation
    let mut map = HashMap::new();
    map.insert("userID", "xxxxxxx");
    map.insert("uploadID", "xKNEhVF");

    //send post request
    let res = client.post("http://127.0.0.1:8000/getChunkCount")
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