mod download_file;
mod view_uploads;


#[cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

fn main() {

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![download_file::download_chunk, view_uploads::get_user_folders, view_uploads::get_user_uploads])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}