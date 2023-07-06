mod upload_file;
mod download_file;


#[cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

fn main() {

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![upload_file::uploaddatabase, upload_file::sendfile, download_file::download_chunk])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}