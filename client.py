import os
import socket
from tkinter import filedialog

from tqdm import tqdm

import createMetaData

IP = socket.gethostbyname(socket.gethostname())
PORT = 65433
ADDR = (IP, PORT)
SIZE = 1024
FORMAT = "utf-8"
FILENAME = filedialog.askopenfilename()
FILESIZE = os.path.getsize(FILENAME)


def sendMetadata(client, metadataPATH):
    # CREATING METADATA FILE

    # print("metadataPATH:", metadataPATH)
    # print("metadataSize = ", os.path.getsize(metadataPATH))
    """ Sending the filename and filesize to the server. """

    data = input("Enter username for socket")
    client.send(data.encode(FORMAT))
    # msg = client.recv(SIZE).decode()
    # print(f"SERVER: {msg}")

    data = f"{metadataPATH}++{os.path.getsize(metadataPATH)}".encode(FORMAT)
    client.send(data)
    msg = client.recv(SIZE).decode()
    print(f"SERVER: {msg}")

    """ METADATA transfer. """
    bar = tqdm(range(os.path.getsize(metadataPATH)), f"Sending METADATA", unit="B", unit_scale=True, unit_divisor=SIZE)
    try:
        f = open(metadataPATH, "rb")
        while True:
            data = f.read(SIZE)

            if not data:
                break

            client.send(data)
            msg = client.recv(SIZE).decode(FORMAT)

            bar.update(len(data))
        client.close()
    finally:
        f.close()
        print("DONE SENDING METADATA!")

    return 0


def sendFile(client):
    """ Sending the filename and filesize to the server. """
    data = f"{FILENAME}_{FILESIZE}".encode(FORMAT)
    client.send(data)
    msg = client.recv(SIZE).decode()
    print(f"SERVER: {msg}")

    bar = tqdm(range(FILESIZE), f"Sending {FILENAME}", unit="B", unit_scale=True, unit_divisor=SIZE)

    with open(FILENAME, "rb") as f:
        while True:
            data = f.read(SIZE)

            if not data:
                break

            client.send(data)
            msg = client.recv(SIZE).decode(FORMAT)

            bar.update(len(data))


def main():
    """ TCP socket and connecting to the server """
    client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    client.connect(ADDR)
    metadataPATH = createMetaData.createMetadata(FILENAME)

    sendMetadata(client, metadataPATH)

    client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    client.connect(ADDR)
    sendFile(client)


if __name__ == "__main__":
    main()
