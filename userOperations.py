import uuid
import os
import sqlite3
from datetime import datetime


def createUser(conn):
    # CREATE UNIQUE ID
    ID = uuid.uuid4()
    DATE = datetime.now().strftime("%m-%d-%Y")
    USERNAME = input("Enter username: ")

    # Insert a user into the USERS table
    cursor = conn.cursor()
    cursor.execute(f'''INSERT INTO USERS (ID, UserName, CreationDate) 
                      VALUES( \"{ID}\",	\"{USERNAME}\" , \"{DATE}\");''')
    conn.commit()

    # CREATE DIRECTORY FOR THE NEW USER
    os.mkdir(f"./ServerFiles/USERS/{str(ID)}")
    print(f"User: {ID} successfully created on {DATE}, with the Username: {USERNAME}")


def deleteUser(conn):
    cursor = conn.cursor()
    ID = input("Enter the user ID to delete: ")
    # REMOVE USER FROM DATABASE
    cursor.execute(f'''DELETE FROM USERS
                       WHERE ID = \"{ID}\";''')
    conn.commit()
    # REMOVE THE USER'S SERVER DIRECTORY (SCHEDULE FOR DELETION)
    src_folder = f"./ServerFiles/USERS/{ID}"
    dst_folder = f"./ServerFiles/USERS/DELETION/{ID}"
    os.rename(src_folder, dst_folder)
    print(f"User: {ID} successfully deleted!")


SQLiteConnection = sqlite3.connect(f'./ServerFiles/UserDatabase.db')

createUser(SQLiteConnection)
deleteUser(SQLiteConnection)

SQLiteConnection.close()
