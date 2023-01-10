import os
import hashlib

import pymongo
from pymongo.errors import DuplicateKeyError

import string
import random
from datetime import datetime


# GENERATES A USER ID THAT HAS NOT ALREADY BEEN TAKEN
def generateNewUserID(db):
    collection = db["USERS"]
    base64_chars = list(string.ascii_uppercase + string.ascii_lowercase + string.digits + '-_')
    while True:
        # GENERATE 7 CHARACTER LONG STRING WITH BASE64 CHARACTERS
        userID = ''.join(random.choices(base64_chars, k=7))
        # CHECK DATABASE TO SEE IF THERE IS A USER WITH THAT ID ALREADY
        collection = db["USERS"]
        query = {"userID": f"{userID}"}
        count = collection.count_documents(query)
        print(userID)
        # IF NO USER IS FOUND, RETURN THE ID
        if count == 0:
            return userID


def createUser(db):
    # CREATE UNIQUE ID
    userID = generateNewUserID(db)
    # TODO: get current date from server, not user's device

    # Get the collection object
    collection = db["USERS"]

    # INSERT NEW USER INTO DATABASE
    successfullyInserted = False
    while not successfullyInserted:
        try:
            DATE = datetime.now().strftime("%m-%d-%Y")

            EMAIL = input("Enter email: ")

            # TODO: A CONFIRM PASSWORD FIELD
            PASSWORD = input("Enter password: ")
            while len(PASSWORD) < 8 or len(PASSWORD) > 32:
                print("Password must be between 8 and 32 characters")
                PASSWORD = input("Enter password again: ")
            hashed_password = hashlib.sha3_256(PASSWORD.encode()).hexdigest()

            USERNAME = input("Enter desired username: ")
            # CREATE JSON DOCUMENT
            userDocument = {
                "userID": f"{userID}",
                "username": f"{USERNAME}",
                "email": f"{EMAIL}",
                "password": f"{hashed_password}",
                "creationDate": f"{DATE}"
            }
            collection.insert_one(userDocument)
            successfullyInserted = True
        except DuplicateKeyError:
            print("That email is already in use!")

    # CREATE DIRECTORY FOR THE NEW USER
    os.mkdir(f"./ServerFiles/USERS/{userID}")
    print(f"User: {userID} successfully created on {DATE}, with the Username: {USERNAME}")


def deleteUser(db, userID):
    # TODO: SEND A DELETE USER TO A PENDING DELETE COLLECTION SO THAT A USER'S ACCOUNT ISN'T PERMANENTLY DELETED

    # REMOVE USER FROM DATABASE
    collection = db["USERS"]
    collection.delete_one({"userID": f"{userID}"})
    # REMOVE THE USER'S SERVER DIRECTORY (SCHEDULE FOR DELETION)
    src_folder = f"./ServerFiles/USERS/{userID}"
    dst_folder = f"./ServerFiles/USERS/DELETION/{userID}"
    os.rename(src_folder, dst_folder)
    print(f"User: {userID} successfully deleted!")


def changeUsername():
    ID = input("Enter the user ID who's username you would like to change: ")
    newUSERNAME = input("Enter the new Username: ")
    client = pymongo.MongoClient("mongodb://localhost:27017")
    db = client["mediaPlatform"]

    # Get the collection object
    collection = db["USERS"]

    # Create a query
    query = {"userID": f"{ID}"}
    newUsername = {"$set": {"username": f"{newUSERNAME}"}}

    # Perform the find operation
    result = collection.find(query)
    collection.update_one(query, newUsername)
    print(f"Username for {ID} successfully changed!")


def searchUser():
    EMAIL = input("Enter username: ")
    PASSWORD = input("Enter password: ")


def getFollowing(db, userID):
    # Get the collection object
    collection = db["FOLLOWING"]

    # Create a query
    query = {"userID": f"{userID}"}
    newUsername = {"$set": {"username": "Jack21"}}

    # Perform the find operation
    result = collection.find(query)


mongoClient = pymongo.MongoClient("mongodb://localhost:27017")
mongoDB = mongoClient["mediaPlatform"]
# createUser(mongoDB)
# changeUsername()
#deleteUser(mongoDB, "gUGLaFi")
# searchUser(SQLiteConnection, SQLiteCursor)
