import sqlite3
import hashlib
import socket

# create the server socket
server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

HOST = socket.gethostname()
PORT = 65433

server_socket.bind((HOST, PORT))

server_socket.listen()
client_socket, client_address = server_socket.accept()

# receive data from the client
data = client_socket.recv(1024)
EMAIL = str(data, 'utf-8')
# print the received data
print("Server recieved Email = ", EMAIL)

data = client_socket.recv(1024)
PASSWORD = str(data, 'utf-8')
# print the received data
print("Server recieved Password = ", PASSWORD)

client_socket.close()

server_socket.close()


def login(db, EMAIL, PASSWORD):


    for result in results:
        hashedPassword = result[0].strip("(,)")
        print(hashedPassword)
    if hashlib.sha3_256(PASSWORD.encode()).hexdigest() == hashedPassword:
        print("SUCCESSFULLY LOGGED IN!")
    else:
        print("Password incorrect :(")



#login(SQLiteConnection, SQLiteCursor)
