const {connectionString} = require("./mongoDBconnection")
const { MongoClient } = require('mongodb');
const crypto = require('crypto');
const { format } = require('date-fns');
const { utcToZonedTime } = require('date-fns-tz');

const client = new MongoClient(connectionString)


//get current UTC formatted date and time "YYYY-MM-DD
function getDateTime() {
    const now = new Date();
    const utcDate = utcToZonedTime(now, 'Etc/UTC');
    return format(utcDate, 'MM-dd-yyyy, HH:mm:ss');
}
//GENERATES A VIDEOID FOR AN UPLOAD
async function generateVideoID(userID) {
    const uploadsCollection = client.db("mediaPlatform").collection("UPLOADS")
    let uploadID = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    const charactersLength = characters.length;
    let repeatCheck = 2
    while(repeatCheck > 0)
    {
        uploadID = ""
        for (let i = 0; i < 7; i++) {
            uploadID += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        repeatCheck = await uploadsCollection.countDocuments({userID: "xxxxxxx", uploadID: uploadID})
        console.log("repeat check" + repeatCheck)
    }
    return uploadID
}
function sha256Hash(input) {
    const hash = crypto.createHash('sha256');
    hash.update(input);
    return hash.digest('hex');
}
//GET FILE TYPE FROM FILE EXTENSION
function getFileType(extension)
{
    console.log("file extension:" + extension)
    const fileTypes = {"wav": "audio", "mp3": "audio", "aac": "audio", "flac": "audio", "ogg": "audio",
        "mp4": "video", "mkv": "video", "mov": "video",
        "jpg": "photo", "png": "photo", "tiff": "photo"}
    return fileTypes[extension]
}
//INSERT CATEGORY INTO DATABASE
async function login(credentials)
{
    console.log("email:" + credentials.email)
    console.log("password:" + credentials.password)
    console.log("hased password:" + sha256Hash(credentials.password))
    const hashedPassword = sha256Hash(credentials.password)
    console.log(connectionString)
    const usersCollection = client.db("mediaPlatform").collection("USERS")
    const account = usersCollection.findOne({"email": credentials.email, "password": hashedPassword})
    if(account)
    {
        //TODO return a login token
        console.log(true)
        return true
    }
    else
    {
        console.log(false)
        return false
    }
}
//add an upload to the database
async function upload(upload)
{
    const uploadsCollection = client.db("mediaPlatform").collection("UPLOADS")
    const uploadID = await generateVideoID(upload.userID)
    const uploadDocument = {
        userID: upload.userID,
        uploadID: uploadID,
        originalFilename: upload.originalFilename,
        fileType: getFileType(upload.fileType),
        fileSize: upload.fileSize,
        title: upload.title,
        description: upload.description,
        uploadDate: getDateTime()
    }
    const insertUpload = uploadsCollection.insertOne(uploadDocument)
}
console.log(getDateTime())
module.exports = {login,upload}