import os
import base64
import random
import string
import pymongo


def generateVideoID(userID):
    base64_chars = list(string.ascii_uppercase + string.ascii_lowercase + string.digits + '-_')

    videoID = ''.join(random.choices(base64_chars, k=7))
    videoID = userID + "_" + videoID
    print("videoID = ", videoID)
    return videoID


generateVideoID("xxxxxxx")
