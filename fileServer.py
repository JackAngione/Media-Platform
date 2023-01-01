import socket
import sqlite3
from tqdm import tqdm

IP = socket.gethostbyname(socket.gethostname())
PORT = 65433
ADDR = (IP, PORT)
SIZE = 1024
FORMAT = "utf-8"
global USERNAME


def saveMetadata(conn, addr):
    """ Receiving the filename and filesize from the client. """
    global USERNAME
    data = conn.recv(SIZE).decode(FORMAT)
    print("USERNAME = ", data)
    USERNAME = data
    data = conn.recv(SIZE).decode(FORMAT)
    item = data.split("++")
    METANAME = item[0]
    METANAME = METANAME.split("/")[-1]
    # print("Item 0 = ", item[0])
    # print("Item 1 = ", item[1])
    METASIZE = int(item[1])

    print(f"[+] METADATA: {METANAME} received from the client.")
    conn.send("METADATA and filesize received".encode(FORMAT))

    bar = tqdm(range(METASIZE), f"Receiving {METANAME}", unit="B", unit_scale=True, unit_divisor=SIZE)
    try:
        f = open(f"./ServerFiles/USERS/{USERNAME}/VIDEOS/{METANAME}", "wb")
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
        print("METADATA FINISHED!")
    # with open(f"./RecievedFiles/{METANAME}", "wb") as f:
    return 0


def saveFile(conn, addr):
    """ Receiving the filename and filesize from the client. """
    data = conn.recv(SIZE).decode(FORMAT)
    item = data.split("_")
    FILENAME = item[0]
    FILENAME = FILENAME.split("/")[-1]
    FILESIZE = int(item[1])

    print(f"[+] Filename: {FILENAME} and filesize received from the client.")
    conn.send("Filename and file size received".encode(FORMAT))

    """ Data transfer """
    bar = tqdm(range(FILESIZE), f"Receiving {FILENAME}", unit="B", unit_scale=True, unit_divisor=SIZE)

    try:
        f = open(f"./ServerFiles/USERS/{USERNAME}/VIDEOS/{FILENAME}", "wb")
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

def sendFile(conn, addr):
    # GET THE USER AND VIDEO THE CLIENT WANTS TO DOWNLOAD
    msg = conn.recv(SIZE).decode()
    USER, VIDEO = msg.split('\n')
    FILENAME = f"./ServerFiles/USERS/{USER}/VIDEOS/{VIDEO}"
    #bar = tqdm(range(FILESIZE), f"Sending {FILENAME}", unit="B", unit_scale=True, unit_divisor=SIZE)

    try:
        f = open(FILENAME, "rb")
        while True:
            data = f.read(SIZE)

            if not data:
                break

            conn.send(data)
            msg = conn.recv(SIZE).decode(FORMAT)

            #bar.update(len(data))
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
        match data:
            case "1":
                print("save file")
                conn.send("[+] SAVE FILE CHOSEN.".encode(FORMAT))
                saveFile(conn, addr)
                # SAVE UPLOAD TO DATABASE HERE
            case "2":
                print("save metadata")
                conn.send("[+] SAVE METADATA CHOSEN.".encode(FORMAT))
                saveMetadata(conn, addr)
            case "3":
                print("SEND FILE TO CLIENT")
                conn.send("[+] DOWNLOAD FILE CHOSEN.".encode(FORMAT))
                sendFile(conn, addr)
            case _:
                print("no action chosen :(")
                break
    server.close()


if __name__ == "__main__":
    main()
