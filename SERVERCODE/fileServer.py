import socket
import pymongo
import os
import createMetaData
from tqdm import tqdm

IP = socket.gethostbyname(socket.gethostname())
PORT = 65434
ADDR = ("127.0.0.1", PORT)
SIZE = 1024
FORMAT = "utf-8"
global userID


def saveFile(conn, addr):
    """ Receiving the filename and filesize from the client. """
    global userID
    userID = conn.recv(SIZE).decode(FORMAT)
    conn.send("userID received".encode(FORMAT))

    TITLE = conn.recv(SIZE).decode(FORMAT)
    conn.send("TITLE received".encode(FORMAT))

    DESC = conn.recv(SIZE).decode(FORMAT)
    conn.send("DESC received".encode(FORMAT))

    originalFilename = conn.recv(SIZE).decode(FORMAT)
    conn.send("original file name received!".encode(FORMAT))

    data = conn.recv(SIZE).decode(FORMAT)
    item = data.split("_")
    FILENAME = item[0]
    FILENAME = FILENAME.split("/")[-1]
    FILESIZE = int(item[-1])

    print(f"[+] Filename: {FILENAME} and filesize received from the client.")
    conn.send("Filename and file size received".encode(FORMAT))

    """ Data transfer """
    bar = tqdm(range(FILESIZE), f"Receiving {FILENAME}", unit="B", unit_scale=True, unit_divisor=SIZE)

    current_dir = os.path.abspath(os.curdir)
    parent_dir = os.path.dirname(current_dir)
    saveFilePath = f"{parent_dir}\\ServerFiles\\USERS\\{userID}\\UPLOADS"

    if not os.path.exists(saveFilePath):
        os.makedirs(saveFilePath)
    client = pymongo.MongoClient("mongodb://localhost:27017")
    db = client["mediaPlatform"]
    videoID = createMetaData.generateVideoID(userID, db)
    saveFilePath = f"{saveFilePath}\\{videoID}"
    try:
        f = open(saveFilePath, "wb")
        while True:
            data = conn.recv(SIZE)
            if not data:
                break
            f.write(data)
            conn.send("Data received.".encode(FORMAT))

            bar.update(len(data))
    finally:
        f.close()
        conn.close()
    createMetaData.uploadMetadata(db, f"{saveFilePath}", userID, videoID, originalFilename, TITLE, DESC)


# SENDS A FILE FROM THE SERVER TO A USER'S CLIENT
def sendFile(conn, addr):
    # GET THE USER AND VIDEO THE CLIENT WANTS TO DOWNLOAD
    USERID = conn.recv(SIZE).decode()
    conn.send("USERID received".encode(FORMAT))

    VIDEOID = conn.recv(SIZE).decode()
    conn.send("VIDEOID received".encode(FORMAT))
    FILENAME = f"./ServerFiles/USERS/{USERID}/UPLOADS/{VIDEOID}"
    # bar = tqdm(range(FILESIZE), f"Sending {FILENAME}", unit="B", unit_scale=True, unit_divisor=SIZE)
    try:
        f = open(FILENAME, "rb")
        while True:
            data = f.read(SIZE)
            if not data:
                break
            conn.send(data)
            msg = conn.recv(SIZE).decode(FORMAT)

            # bar.update(len(data))
    finally:
        f.close()
        conn.close()
    print("done sending file to client!")


def main():
    # Creating a TCP server socket
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.bind(ADDR)
    server.listen()
    print("[+] Listening...")
    while True:
        print("[+] Looking for new client.....")
        # Accepting the connection from the client.
        conn, addr = server.accept()
        print(f"[+] Client connected from {addr[0]}:{addr[1]}")

        data = conn.recv(SIZE).decode(FORMAT)
        print(data)
        match data:
            case "1":
                print("save file")
                conn.send("[+] SAVE FILE CHOSEN.".encode(FORMAT))
                saveFile(conn, addr)
            case "3":
                print("SEND FILE TO CLIENT")
                conn.send("[+] DOWNLOAD FILE CHOSEN.".encode(FORMAT))
                sendFile(conn, addr)
            case _:
                print("no action chosen :(")
    server.close()


if __name__ == "__main__":
    main()
