use std::fmt::format;
use std::fs;
use std::path::{Path, PathBuf};

//lists all folders inside of a given folder
#[tauri::command(rename_all = "snake_case")]
pub fn get_user_folders() -> Vec<String> {
    let path =  Path::new("../downloaded_files/");
    let mut user_folders = Vec::new();
    if path.is_dir()
    {
        //looks through a directory path
        for entry in fs::read_dir(path).unwrap() {
            let entry = entry.unwrap();
            let path = entry.path();
            //filter only by folders, not files
            if path.is_dir() {
                //println!("{}", &path.display());
                let os_str = path.file_name().unwrap().to_owned();
                let str = os_str.to_str().unwrap().to_owned();
                user_folders.push(str);
            }
        }
    }
    return user_folders;
}
//takes in a username and searches that user's folder for all files
#[tauri::command(rename_all = "snake_case")]
pub fn get_user_uploads(user_id: &str) -> Vec<String>
{
    let user_path_string = format!("../downloaded_files/{}", user_id);
    let path =  Path::new(&user_path_string);
    //keep a vector of the file names of each upload
    let mut uploads = Vec::new();

    if path.is_dir()
    {
        //looks through a directory path
        for entry in fs::read_dir(path).unwrap() {
            let entry = entry.unwrap();
            let path = entry.path();
            //filter only by folders, not files
            if !path.is_dir() {
                println!("{}", &path.display());
                let os_str = path.file_name().unwrap().to_owned();
                let str = os_str.to_str().unwrap().to_owned();
                let final_upload_path = format!("../{}/{}", user_path_string, &str);
                println!("{}", &final_upload_path);
                uploads.push(final_upload_path);
            }
        }
        for i in &uploads
        {
            println!("{}", i);
        }
    }
    return uploads;
}