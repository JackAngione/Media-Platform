import os
import pymongo


def createUploadDatabase(METADATAFILE):
    try:
        f = open(f"./ServerFiles/USERS/06bc40cf41219c012cbc2d6597283326/VIDEOS/{METADATAFILE}", "r")
        lines = f.readlines()
        USER = lines[2].strip()
        TITLE = lines[3].strip()
        DESC = lines[4].strip()
        COLLAB = lines[5].strip()
        UPLOAD_DATE = lines[6].strip()


    finally:
        f.close()


# def deleteUploadDatabase(videoID):

def getUploads(db, userID):
    collection = db["UPLOADS"]
    document = collection.find_one({"userID": f"{userID}"})
    print(document["userUploads"])
    collection.update_one({'userID': f"{userID}"}, {'$push': {"userUploads": "xxx_hihihihi"}})
    document = collection.find_one({"userID": f"{userID}"})
    print(document["following"])

    
mongoClient = pymongo.MongoClient("mongodb://localhost:27017")
mongoDB = mongoClient["mediaPlatform"]
getUploads(mongoDB, "xxxxxxx")
# metadata = f"theroad[optimvsgrimeremix][newfinal]_metaData.txt"

# createUploadDatabase(metadata)
# deleteUploadDatabase("3 TITLE: asdf", "2 USER: asdf")
