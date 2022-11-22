import socket

from tqdm import tqdm

IP = socket.gethostbyname(socket.gethostname())
PORT = 65432
ADDR = (IP, PORT)
SIZE = 1024
FORMAT = "utf-8"


def saveMetadata(conn, addr):
    """ Receiving the filename and filesize from the client. """
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
        f = open(f"./RecievedFiles/{METANAME}", "wb")
        while True:
            data = conn.recv(SIZE)
            if not data:
                break

            f.write(data)
            conn.send("Data received.".encode(FORMAT))

            bar.update(len(data))
    finally:
        f.close()
    #with open(f"./RecievedFiles/{METANAME}", "wb") as f:

    print("SERVER: METADATA SAVED SUCCESSFULLY!!!")
    return 0


def saveFile(conn, addr):
    """ Receiving the filename and filesize from the client. """
    data = conn.recv(SIZE).decode(FORMAT)
    item = data.split("_")
    FILENAME = item[0]
    FILENAME = FILENAME.split("/")[-1]
    FILESIZE = int(item[1])

    print(f"[+] Filename: {FILENAME} and filesize received from the client.")
    conn.send("Filename and filesize received".encode(FORMAT))

    """ Data transfer """
    bar = tqdm(range(FILESIZE), f"Receiving {FILENAME}", unit="B", unit_scale=True, unit_divisor=SIZE)

    with open(f"./RecievedFiles/{FILENAME}", "wb") as f:
        while True:
            data = conn.recv(SIZE)
            if not data:
                break

            f.write(data)
            conn.send("Data received.".encode(FORMAT))

            bar.update(len(data))
    print("FILE SUCCESSFFULLY SAVED!!!!!")


def main():
    """ Creating a TCP server socket """
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.bind(ADDR)
    server.listen()
    print("[+] Listening...")

    """ Accepting the connection from the client. """
    conn, addr = server.accept()
    print(f"[+] Client connected from {addr[0]}:{addr[1]}")
    saveMetadata(conn, addr)
    saveFile(conn, addr)

    """ Closing connection. """
    conn.close()
    server.close()


if __name__ == "__main__":
    main()
