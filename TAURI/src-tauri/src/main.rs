extern crate serde;
extern crate serde_json;
use std::io::prelude::*;
use std::net::TcpStream;
use serde::{Serialize, Deserialize};
use sha2::{Sha256, Digest};

#[cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn login(email: &str, password: &str) -> String
{   
    #[derive(Serialize, Deserialize, Debug)]
    struct LoginJSON {
        emailJSON: String,
        passJSON: String
    }
    let mut hasher = Sha256::new();
    hasher.update(password.as_bytes());

    let hashedPassword: String = format!("{:X}",hasher.finalize());
    let LoginCredentials = LoginJSON{
        emailJSON: email.to_string(),
        passJSON: hashedPassword
    };
    let serialized = serde_json::to_string(&LoginCredentials);
    let mut stream = TcpStream::connect("127.0.0.1:65434").unwrap();
    stream.write_all(serialized.unwrap().as_bytes());
    
    
    let mut buffer = [0; 1024];
    stream.read(&mut buffer).unwrap(); 
    let message = String::from_utf8_lossy(&buffer);
    println!("Received message from client: {}", message);


    
    format!("Hello, {}! Password is: {}!", email, password)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![login])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}