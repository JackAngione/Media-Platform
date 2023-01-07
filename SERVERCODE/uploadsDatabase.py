import os
import pymongo
import random
import string


def createUploadDatabase(db, userID, videoID, METADATAFILE):
    collection = db["UPLOADS"]
    try:
        f = open(f"./ServerFiles/USERS/{userID}/VIDEOS/{METADATAFILE}", "r")
        lines = f.readlines()
        USER = lines[2].strip()
        TITLE = lines[3].strip()
        DESC = lines[4].strip()
        COLLAB = lines[5].strip()
        UPLOAD_DATE = lines[6].strip()
        collection.update_one({'userID': f"{userID}"}, {'$push': {"userUploads": f"videoID"}})
    finally:
        f.close()


def generateVideoID(userID):
    base64_chars = list(string.ascii_uppercase + string.ascii_lowercase + string.digits + '-_')

    videoID = ''.join(random.choices(base64_chars, k=7))
    videoID = userID + "_" + videoID
    print("videoID = ", videoID)
    return videoID


# def deleteUploadDatabase(videoID):

def getUploads(db, userID):
    collection = db["UPLOADS"]
    document = collection.find_one({"userID": f"{userID}"})
    print(document["userUploads"])


mongoClient = pymongo.MongoClient("mongodb://localhost:27017")
mongoDB = mongoClient["mediaPlatform"]
getUploads(mongoDB, "xxxxxxx")
# metadata = f"theroad[optimvsgrimeremix][newfinal]_metaData.txt"

# createUploadDatabase(metadata)
# deleteUploadDatabase("3 TITLE: asdf", "2 USER: asdf")
