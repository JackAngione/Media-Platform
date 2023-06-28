mod pull_uploads;
mod uploadFile;

use std::io::prelude::*;
use std::net::TcpStream;
use std::str;
use std::io::{Error, ErrorKind};
use mongodb::{Client};
use tokio;
use mongodb::bson::{doc, Document};
use serde_json::json;
use serde::{Serialize, Deserialize};
use sha2::{Sha256, Digest};


#[cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn rustlogin(email: &str, password: &str) -> bool
{
    #[derive(Serialize, Deserialize, Debug)]
    struct LoginJson {
        email_json: String,
        pass_json: String
    }
    let mut hasher = Sha256::new();
    hasher.update(password.as_bytes());
    let hashed_password: String = format!("{:X}",hasher.finalize());
    let login_credentials = LoginJson{
        email_json: email.to_string(),
        pass_json: hashed_password
    };
    let serialized = serde_json::to_string(&login_credentials);
    //let mut stream = TcpStream::connect("127.0.0.1:65434");

    if let Ok(mut stream) = TcpStream::connect("127.0.0.1:65434") {
        println!("Connected to the server!");
        stream.write_all(serialized.unwrap().as_bytes()).expect("Could not send data to server?");

        stream.flush().unwrap();
        let mut buffer = vec![0; 1024];
        let read_bytes = stream.read(&mut buffer).unwrap();
        buffer.truncate(read_bytes);
        let mut message = str::from_utf8(&buffer).unwrap();
        //REMOVES TRAILING NULLS (0's) FROM THE BUFFER CONVERSION
        message = message.trim_matches(char::from(0));

        if message.eq("True")
        {
            println!("returning true!");
            return true;
        }
        else
        {
            println!("returning false!");
            return false.into(); }

    } else {
        println!("Couldn't connect to server...");
        return false.into();
    }
}

fn main() {

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![rustlogin, pull_uploads::getuser, pull_uploads::getuploads, pull_uploads::downloadfileftp, uploadFile::uploaddatabase, uploadFile::sendfile])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}