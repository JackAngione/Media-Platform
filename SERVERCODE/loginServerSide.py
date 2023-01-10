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
    else:
        print("Password incorrect :(")


# create the server socket
server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
ADDR = "127.0.0.1"
PORT = 65434

server.bind((ADDR, PORT))

server.listen()
print("[+] Listening...")
print("[+] Looking for new client.....")
# Accepting the connection from the client.
conn, addr = server.accept()
print(f"[+] Client connected from {addr[0]}:{addr[1]}")

# GET LOGIN JSON
data = conn.recv(1024).decode('utf-8')
JSONLOGIN = json.loads(data)

# print the login data
print("Server received Email = ", JSONLOGIN["emailJSON"])

print("Server received Password = ", JSONLOGIN["passJSON"])

mongoClient = pymongo.MongoClient("mongodb://localhost:27017")
mongoDB = mongoClient["mediaPlatform"]
login(mongoDB, JSONLOGIN["emailJSON"], JSONLOGIN["passJSON"].lower())

conn.close()
server.close()
