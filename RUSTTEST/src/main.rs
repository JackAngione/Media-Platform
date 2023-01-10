extern crate sha2;
use sha2::{Sha256, Digest};
fn main() {
    let mut hasher = Sha256::new();
    let password = "123124";
    // Write input message
    hasher.update(password.as_bytes());

    // Calculate hash
    let hash = hasher.finalize();

    println!("{:x}", hash);
}
