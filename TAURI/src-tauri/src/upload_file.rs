use std::fs::File;
use std::io::{BufReader, Read, Write};
use std::net::TcpStream;
//use dict::{Dict, DictEntry, DictIface};
use mongodb::bson::{doc, Document};
use mongodb::{Client, Collection};
use serde_json::json;
use serde::{Deserialize, Serialize};
//use rand::{thread_rng, Rng};
use nanorand::{Rng, WyRand};


fn getFileType(fileType: &str) -> &str
{
    let splitFileType: Vec<&str> = fileType.split("/").collect();
    return splitFileType[0];
}

async fn generatevideoid(userid: &str) -> String {
    let base64_chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

    let mut rng = WyRand::new();

    let client = Client::with_uri_str("mongodb://localhost:27017").await.unwrap();
    let db = client.database("mediaPlatform");
    let coll = db.collection::<Document>("UPLOADS");
    loop
    {
        let videoid: String = (0..7)
            .map(|_| base64_chars.chars().nth(rng.generate_range(1_usize..=64)).unwrap())
            .collect();
        let filter = doc! { "userID": &userid, "videoID": &videoid};
        let cursor = coll.find_one(filter, None).await.unwrap();
        if  cursor == None
        {
            return videoid;
        }
    }
}
//THIS FUNCTION HAS TO RETURN A RESULT OR ELSE TUARI COMMAND ISN'T STATIC
#[tauri::command]
pub async fn uploaddatabase(metadata: &str) -> Result<(String), (String)>
{
    #[derive(Serialize, Deserialize)]
    pub struct Upload {
        userid: String,
        videoid: String,
        ogFileName: String,
        filetype: String,
        title: String,
        description: String,
        filesize: String,
        uploadDate: String
    }
    let client = Client::with_uri_str("mongodb://localhost:27017").await.unwrap();
    let db = client.database("mediaPlatform");
    let coll = db.collection::<Document>("UPLOADS");
    //println!("VALUE: {}",jsonFile["title"]);

    let mut metadataJSON: Upload = serde_json::from_str(metadata).unwrap();

    metadataJSON.videoid = generatevideoid(&metadataJSON.userid).await;
    metadataJSON.filetype = getFileType(&metadataJSON.filetype).to_string();
    //let docupload = doc!{"userID": metadata.get("userid"), "videoID": metadata.get("videoid"), "originalFilename": metadata.get("ogFileName"), "fileType": metadata.get("fileType"), "title": metadata.get("title"), "description": metadata.get("description"), "fileSize": metadata.get("filesize"), "uploadDate": metadata.get("uploadDate")};
    let docupload = doc!{"userID": metadataJSON.userid, "videoID": metadataJSON.videoid, "originalFilename": metadataJSON.ogFileName, "fileType": metadataJSON.filetype, "title": metadataJSON.title, "description": metadataJSON.description, "fileSize": metadataJSON.filesize, "uploadDate": metadataJSON.uploadDate};
    coll.insert_one(docupload, None).await.expect("couldnt upload document");
    let strreturn = "havetoreturnthis".to_string();
    return Ok(strreturn);
}

#[tauri::command]
pub fn sendfile(mut filedata: &str) -> String
{
    let mut bytes: Vec<u8> = vec![];
    let mut message = b"1234567xxxxxxx".to_vec();
    if filedata.len() == 0
    {
        //filedata = "done".as_bytes().to_vec();
        //message.extend(&filedata);
        send_to_stream(&message);
    }
    else {
        bytes = filedata
            .split(',')
            .map(|s| s.parse().expect("coudlnt convert string to bytes"))
            .collect::<Vec<u8>>();
    }

    //println!("{:?}", &bytes);

    println!("sending chunk...");
    //println!("{:?}", bytes);
    //CHUNK SIZE
    //let chunk_size = 10_000_014;

    println!("{} bytes read", &bytes.len());

    message.extend(&bytes);

    send_to_stream(&message);
    println!("done sending");
    return "Successfully sent file!".to_string();
}
pub fn send_to_stream(data: &Vec<u8>)
{
    let mut stream = TcpStream::connect("127.0.0.1:8200").expect("couldnt connect to server");
    stream.write_all(data).expect("Error writing to stream");
    stream.flush().expect("couldnt flush stream");
    println!("chunk sent!");
}