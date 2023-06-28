import math
import os
import filetype
import string
import random
from datetime import datetime

import pymongo
from pytz import timezone

utc = timezone('UTC')


class FileError(Exception):
    pass


def getFileType(extension):
    extension = "." + extension
    fileTypes = {".wav": "audio", ".mp3": "audio", ".aac": "audio", ".flac": "audio",
                 ".mp4": "video", ".mkv": "video", ",mov": "video",
                 ".jpg": "photo", ".png": "photo", ".tiff": "photo"}
    # audio = [".wav", ".mp3", ".m4a", ".aac", ".flac"]
    # video = [".mp4", ".mkv", ".mov"]
    # photo = [".jpg", ".png", ".tiff"]

    try:
        fileType = fileTypes[extension.lower()]
        return fileType
    except KeyError:
        raise FileError("Invalid FileType")


def getSize(size_bytes):
    if size_bytes == 0:
        return "0B"
    size_name = ("B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB")
    i = int(math.floor(math.log(size_bytes, 1024)))
    p = math.pow(1024, i)
    s = round(size_bytes / p, 2)
    return "%s %s" % (s, size_name[i])


def uploadMetadata(db, filepath, USERID, VIDEOID, OGNAME, TITLE, DESC):
    FILENAME = filepath.split("\\")[-1]
    print("FILENAME = ", FILENAME)
    kind = filetype.guess(filepath)
    FILE_EXT = kind.extension
    FILETYPE = getFileType(FILE_EXT)

    fileSizePath = filepath.rsplit("\\", 1)[0]
    print("FILESIZEPATH = ", fileSizePath)
    FILESIZE = getSize(os.path.getsize(filepath))

    print("original File Name = ", OGNAME)
    print("File size = ", FILESIZE)
    print("FILE Extension: ", FILE_EXT)
    print("FILE TYPE: ", FILETYPE)
    # TODO: GET DATE FROM SERVER INSTEAD OF CLIENT
    currentDate = datetime.now(utc).strftime("%m/%d/%Y, %H:%M:%S")

    # COLLABORATORS = input("Enter the Usernames of any collaborators (if none, press enter): ")
    # CREATE FILE
    collection = db["UPLOADS"]
    # VIDEOID = generateVideoID(USERID, db)
    userDocument = {
        "userID": f"{USERID}",
        "videoID": f"{VIDEOID}",
        "originalFilename": f"{OGNAME}",
        "fileType": f"{FILETYPE}",
        # "fileExtension": f"{FILE_EXT}",
        "title": f"{TITLE}",
        "description": f"{DESC}",
        "fileSize": f"{FILESIZE}",
        "uploadDate": f"{currentDate}",
    }
    collection.insert_one(userDocument)
    print("video uploaded to database!")
    return VIDEOID


def generateVideoID(userID, db):
    base64_chars = list(string.ascii_uppercase + string.ascii_lowercase + string.digits + '-_')
    collection = db["UPLOADS"]
    while True:
        # GENERATE 7 CHARACTER LONG STRING WITH BASE64 CHARACTERS
        videoID = ''.join(random.choices(base64_chars, k=7))

        # CHECK DATABASE TO SEE IF THERE IS A USER WITH THAT ID ALREADY
        query = {"userID": f"{userID}", "videoID": f"{videoID}"}
        count = collection.count_documents(query)
        # IF NO VIDEOID UNDER USER IS FOUND, RETURN THE VIDEOID
        if count == 0:
            print("videoID is unique!")
            return videoID


client = pymongo.MongoClient("mongodb://localhost:27017")
db = client["mediaPlatform"]
videoID = generateVideoID("xxxxxxx", db)
# path = "/Client's computer/USERS/06bc40cf41219c012cbc2d6597283326/VIDEOS/theroad[optimvsgrimeremix][newfinal].wav"
uploadMetadata(db, "../Client's computer/upload222.mp4", "xxhhhxx", videoID, "original name", "title222!!",
               "description 2")
