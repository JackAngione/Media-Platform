# metadata format:
# original file name
# filesize
#
# Video title
# Video description
import math
import os

from tkinter import filedialog

from datetime import datetime
from pytz import timezone

utc = timezone('UTC')


class FileError(Exception):
    pass


def getFileType(extension):
    fileTypes = {".wav":"Audio", ".mp3": "Audio", ".aac": "Audio", ".flac": "Audio",
                 ".mp4": "Video", ".mkv": "Video", ",mov": "Video",
                 ".jpg": "Photo", ".png": "Photo", ".tiff": "Photo"}
    # Audio = [".wav", ".mp3", ".m4a", ".aac", ".flac"]
    # Video = [".mp4", ".mkv", ".mov"]
    # Photo = [".jpg", ".png", ".tiff"]

    try:
        fileType = fileTypes[extension.lower()]
        return fileType
    except KeyError:
        raise FileError("Invalid FileType")


def convert_size(size_bytes):
    if size_bytes == 0:
        return "0B"
    size_name = ("B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB")
    i = int(math.floor(math.log(size_bytes, 1024)))
    p = math.pow(1024, i)
    s = round(size_bytes / p, 2)
    return "%s %s" % (s, size_name[i])


def createMetadata(filepath):
    FILENAME = filepath.split("/")[-1]
    FILE_EXT = os.path.splitext(FILENAME)[1]
    FILETYPE = getFileType(FILE_EXT)

    FILESIZE = convert_size(os.path.getsize(filepath))

    print("FILE TYPE: ", FILETYPE)
    print("File Name = ", FILENAME)
    print("File size = ", FILESIZE)
    print("FILE Extension: ", FILE_EXT)
    USER = input("Enter User: ")
    TITLE = input("Enter Video Title: ")
    DESC = input("Enter Video Description: ")
    # CREATE FILE
    metaFilePath = filepath.removesuffix(FILENAME)
    FILENAME = os.path.splitext(FILENAME)[0]
    with open(f"{metaFilePath}/{FILENAME}_metaData.txt", 'w') as f:
        f.write("FILENAME: ")
        f.write(FILENAME)

        f.write("\nFILESIZE: ")
        f.write(FILESIZE)

        f.write("\nUSER: ")
        f.write(USER)

        f.write("\nTITLE: ")
        f.write(TITLE)

        f.write("\nDESC: ")
        f.write(DESC)

        f.write("\nUPLOAD DATE: ")
        f.write(datetime.now(utc).strftime("%m/%d/%Y, %H:%M:%S"))

        return f"{metaFilePath}/{FILENAME}_metaData.txt"
#FILE = filedialog.askopenfilename()
#createMetadata(FILE)
