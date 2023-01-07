import filetype
from tkinter import filedialog


FILE = filedialog.askopenfilename()
print(FILE)

kind = filetype.guess(FILE)
FILE_EXT = kind.extension
FILETYPE = kind.mime
print(FILE_EXT)
print(FILETYPE)


def fixFilename(filename):
    print("IF YOU ARE SEEING THIS, YOUR SUBMITTED FILENAME IS WACK SO I'M FIXING IT!!!")
    removedSpaces = filename.replace(" ", "-")
    charList = list(removedSpaces)
    print(charList)
    for i in range(0, len(charList), -1):
        if i == ".":
            charList.remove(i)

    print(charList)



#test_string = "Hello. My name is John. I am 25 years old."
#fixFilename(test_string)
