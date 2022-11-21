# metadata format:
# original file name
# filesize
#
# video title
# video description
import os
import math
import tkinter as tk
from tkinter import filedialog


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
    FILESIZE = convert_size(os.path.getsize(filepath))
    print("Enter User: ")
    USER = input()
    print("File Name = ", FILENAME)
    print("File size = ", FILESIZE)
    # CREATE FILE
    metaFilePath = filepath.removesuffix(FILENAME)
    print(metaFilePath)
    with open(f"{metaFilePath}/metaData.txt", 'w') as f:
        f.write("FILENAME: ")
        f.write(FILENAME)
        f.write("FILESIZE: ")
        f.write(FILESIZE)
        f.write("USER: ")
        f.write(USER)


FILENAME = filedialog.askopenfilename()
createMetadata(FILENAME)
