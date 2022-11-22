import os
import socket
from tkinter import filedialog

from tqdm import tqdm

import createMetaData

IP = socket.gethostbyname(socket.gethostname())
PORT = 65432
ADDR = (IP, PORT)
SIZE = 1024
FORMAT = "utf-8"
FILENAME = filedialog.askopenfilename()
FILESIZE = os.path.getsize(FILENAME)


def main():
    """ TCP socket and connecting to the server """
    client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    client.connect(ADDR)
    #CREATING METADATA FILE
    createMetaData.createMetadata(FILENAME);
    """ Sending the filename and filesize to the server. """
    data = f"{FILENAME}_{FILESIZE}".encode(FORMAT)
    client.send(data)
    msg = client.recv(SIZE).decode()
    print(f"SERVER: {msg}")

    """ Data transfer. """
    bar = tqdm(range(FILESIZE), f"Sending {FILENAME}", unit="B", unit_scale=True, unit_divisor=SIZE)

    with open(FILENAME, "rb") as f:
        while True:
            data = f.read(SIZE)

            if not data:
                break

            client.send(data)
            msg = client.recv(SIZE).decode(FORMAT)

            bar.update(len(data))

    """ Closing the connection """
    client.close()


if __name__ == "__main__":
    main()
