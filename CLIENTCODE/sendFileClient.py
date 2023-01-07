import os
import socket
from tkinter import filedialog

from tqdm import tqdm

from SERVERCODE import createMetaData

# IP = socket.gethostbyname(socket.gethostname())
PORT = 65434
ADDR = ("127.0.0.1", PORT)
SIZE = 1024
FORMAT = "utf-8"
global FILENAME
global FILESIZE
global formattedFileName
global userID
#FILENAME = filedialog.askopenfilename()


def sendMetadata(client, metadataPATH):
    # CREATING METADATA FILE

    # print("metadataPATH:", metadataPATH)
    # print("metadataSize = ", os.path.getsize(metadataPATH))
    """ Sending the filename and filesize to the server. """

    data = input("Enter userID for socket")
    client.send(data.encode(FORMAT))
    # msg = client.recv(SIZE).decode()
    # print(f"SERVER: {msg}")

    #data = f"{metadataPATH}++{os.path.getsize(metadataPATH)}".encode(FORMAT)
    #client.send(data)
    #msg = client.recv(SIZE).decode()
    #print(f"SERVER: {msg}")

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


def sendFile(client):
    global userID
    global FILENAME
    global FILESIZE
    """ Sending the filename and filesize to the server. """
    userID = input("Enter userID for which to upload the file to: ")
    client.send(f"{userID}".encode(FORMAT))
    msg = client.recv(SIZE).decode()
    print(f"SERVER: {msg}")

    TITLE = input("Enter TITLE for which to upload the file to: ")
    client.send(f"{TITLE}".encode(FORMAT))
    msg = client.recv(SIZE).decode()
    print(f"SERVER: {msg}")

    DESC = input("Enter DESC for which to upload the file to: ")
    client.send(f"{DESC}".encode(FORMAT))
    msg = client.recv(SIZE).decode()
    print(f"SERVER: {msg}")

    originalFileName = os.path.basename(FILENAME)
    client.send(f"{originalFileName}".encode(FORMAT))
    msg = client.recv(SIZE).decode()
    print(f"SERVER: {msg}")

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


def getFile(client):
    USER = input("Enter User who's video you'd like to download: ")
    VIDEOID = input("Enter ID of video to download: ")
    data = VIDEOID
    client.sendall(bytes(data, 'utf-8'))

    directory = os.path.dirname(f"./Client's computer/USERS/{USER}/VIDEOS/{VIDEOID}")
    if not os.path.exists(directory):
        os.makedirs(directory)
    # bar = tqdm(range(FILESIZE), f"Receiving {formattedFileName}", unit="B", unit_scale=True, unit_divisor=SIZE)
    try:
        count = 0
        f = open(f"./Client's computer/USERS/{USER}/VIDEOS/{VIDEOID}", "wb")
        while True:
            data = client.recv(SIZE)
            if not data:
                break

            f.write(data)
            client.send("Data received.".encode(FORMAT))
            # bar.update(len(data))

    finally:
        f.close()
    print("DonE!!!!")


def main():
    global FILENAME
    global FILESIZE
    global formattedFileName
    # TELL SERVER CLIENT IS SENDING METADATA
    print("what do you want to do?")
    print("1: UPLOAD FILE")
    print("2: DOWNLOAD FILE")
    action = input()

    match action:
        case "1":
            # UPLOAD FILE TO SERVER
            FILENAME = filedialog.askopenfilename()
            FILESIZE = os.path.getsize(FILENAME)


            # TELL SERVER CLIENT IS NOW SENDING FILE
            client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            client.connect(ADDR)
            data = "1".encode(FORMAT)
            client.send(data)
            msg = client.recv(SIZE).decode(FORMAT)
            print("SERVER: ", msg)
            sendFile(client)
        case "2":
            # DOWNLOAD FILE FROM SERVER
            client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            client.connect(ADDR)
            data = "3"
            client.send(bytes(data, 'utf-8'))
            msg = client.recv(SIZE).decode(FORMAT)
            print("SERVER: ", msg)
            getFile(client)


if __name__ == "__main__":
    main()
