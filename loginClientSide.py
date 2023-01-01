import socket
import userOperations

# create the client socket
client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

HOST = socket.gethostname()
PORT = 65433

client.connect((HOST, PORT))

EMAIL = input("Enter Email: ")
client.sendall(bytes(EMAIL, 'utf-8'))

PASSWORD = input("Enter password: ")
client.sendall(bytes(PASSWORD, 'utf-8'))

# close the client socket
client.close()
