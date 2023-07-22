use mongodb::{Client};
use mongodb::bson::{doc, Document};
use serde_json::json;
use serde_json::{to_string};
use serde::{Deserialize, Serialize};
use futures::stream::TryStreamExt;
use std::fs::File;
use std::io::{BufReader, Read};
use std::io::{Write};


#[tauri::command]
pub async fn getuser(username: &str) -> Result<(String), (String)> {
    let client = Client::with_uri_str("mongodb://localhost:27017").await.unwrap();
    let db = client.database("mediaPlatform");
    let coll = db.collection::<Document>("USERS");
    let filter = doc! { "user_id": username };
    let cursor = coll.find_one(filter, None).await.unwrap();
    let mut json_data ="ERROR, USER NOT FOUND".to_string();
    match cursor
    {
        Some(ref document) => {
            let user_id = document.get_str("user_id").unwrap();
            let username = document.get_str("username").unwrap();

            json_data = json!({
                "user_id": user_id,
                "username": username,
            }).to_string();
            println!("{}", json_data);
            println!("successfully created JSON!");
        },
        None => println!("ERROR, USER NOT FOUND")
    }
    return Ok(json_data)
}
#[tauri::command]
pub async fn getuploads(user_id: &str) -> Result<(String), (String)>
{
    #[derive(Debug, Serialize, Deserialize)]
    struct Upload {
        videoID: String,
        title: String,
        description: String,
        uploadDate: String
    }
    let mut all_uploads = Vec::new();
    let mut uploads_json = "NO UPLOADS FOUND".to_string();

    let client = Client::with_uri_str("mongodb://localhost:27017").await.unwrap();
    let db = client.database("mediaPlatform");
    let coll = db.collection::<Upload>("UPLOADS");


    let filter = doc! { "user_id": user_id};
    let mut cursor = coll.find(filter, None).await.expect("failed to find");

    while let Some(video) = cursor.try_next().await.expect("no more uploads")
    {
        println!("videoID: {}", video.videoID);
        all_uploads.push(video);
    }

    uploads_json = to_string(&all_uploads).unwrap();
    //print!("{}", json_str);
    return Ok(uploads_json)
}

