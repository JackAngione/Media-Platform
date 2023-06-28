use mongodb::{Client};
use mongodb::bson::{doc, Document};
use serde_json::json;
use serde_json::{to_string};
use serde::{Deserialize, Serialize};
use futures::stream::TryStreamExt;
use std::fs::File;
use std::io::{BufReader, Read};
use suppaftp::{FtpStream};
use std::io::{Write};


#[tauri::command]
pub async fn getuser(username: &str) -> Result<(String), (String)> {
    let client = Client::with_uri_str("mongodb://localhost:27017").await.unwrap();
    let db = client.database("mediaPlatform");
    let coll = db.collection::<Document>("USERS");
    let filter = doc! { "userID": username };
    let cursor = coll.find_one(filter, None).await.unwrap();
    let mut json_data ="ERROR, USER NOT FOUND".to_string();
    match cursor
    {
        Some(ref document) => {
            let userID = document.get_str("userID").unwrap();
            let username = document.get_str("username").unwrap();

            json_data = json!({
                "userID": userID,
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
pub async fn getuploads(userid: &str) -> Result<(String), (String)>
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


    let filter = doc! { "userID": userid};
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

#[tauri::command]
pub fn downloadfileftp(userid: &str, videoid: &str) {

    let mut ftp = FtpStream::connect("127.0.0.1:21").expect("couldnt connect");
    let _ = ftp.login("Test", "123").expect("couldnt login");
    //let userDirectory = ""
    let _ = ftp.cwd(format!("USERS/{}/UPLOADS", userid)).expect("change directory");
    println!("Current directory: {}", ftp.pwd().expect("no current directory??"));
    //let filepath = format!("USERS/{}/testDOWN.txt", user_id);
    println!("DOWNLOADING: {} from user {}", videoid, userid);
    let mut ftp_file = ftp.retr_as_stream(videoid).unwrap();


    let mut buffer = [0; 1024];
    let mut reader = BufReader::new(&mut ftp_file);
    let mut local_file = File::create(videoid).unwrap();
    // Read the data stream in 1024 byte chunks
    loop
    {
        let bytes_read = reader.read(&mut buffer).unwrap();
        if bytes_read == 0 { break; }
        local_file.write_all(&buffer[..bytes_read]).unwrap();
    }

    ftp.finalize_retr_stream(ftp_file).expect("Couldn't finalize stream");
    println!("Successfully retrieved {} from FTP server!", videoid);
    ftp.quit().expect("Couldn't quit FTP server :(");
}