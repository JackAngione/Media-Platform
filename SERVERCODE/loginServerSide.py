import pymongo
import hashlib
import socket
import json


def login(db, EMAIL, PASSWORD):
    collection = db["USERS"]
    query = {"email": EMAIL, "password": PASSWORD}
    document = collection.find_one(query)

    if document:
        print("SUCCESSFULLY LOGGED IN!")
        return True
    else:
        print("Password incorrect :(")
        return False


# create the server socket
server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
ADDR = "127.0.0.1"
PORT = 65434
SIZE = 1024
FORMAT = "utf-8"

server.bind((ADDR, PORT))

server.listen()
print("[+] Listening...")
print("[+] Looking for new client.....")
while True:
    # Accepting the connection from the client.
    conn, addr = server.accept()
    print(f"[+] Client connected from {addr[0]}:{addr[1]}")

    # GET LOGIN JSON
    data = conn.recv(1024).decode('utf-8')
    JSONLOGIN = json.loads(data)

    # print the login data
    print("Server received Email = ", JSONLOGIN["email_json"])
    print("Server received Password = ", JSONLOGIN["pass_json"])

    mongoClient = pymongo.MongoClient("mongodb://localhost:27017")
    mongoDB = mongoClient["mediaPlatform"]
    loginStatus = login(mongoDB, JSONLOGIN["email_json"], JSONLOGIN["pass_json"].lower())

    print(f"Login Status: {loginStatus}")
    if loginStatus == "False":
        print("EVALUATES TO FALSE!!!")

    conn.send(f"{loginStatus}".encode(FORMAT))
    #conn.send("hello".encode(FORMAT))
# msg = conn.recv(SIZE).decode()
conn.close()
server.close()
