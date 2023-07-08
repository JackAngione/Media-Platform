const {connectionString} = require("./mongoDBconnection")
const { MongoClient } = require('mongodb');
const crypto = require('crypto');
const { format } = require('date-fns');
const { utcToZonedTime } = require('date-fns-tz');
const jwt = require('jsonwebtoken');
const {JWTKey} = require("./mongoDBconnection")
const client = new MongoClient(connectionString)
const moment = require('moment');

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
    console.log("hashed password:" + sha256Hash(credentials.password))
    const hashedPassword = sha256Hash(credentials.password)

    const usersCollection = client.db("mediaPlatform").collection("USERS")
     const account = await usersCollection.findOne({"email": credentials.email, "password": hashedPassword})
    if(account)
    {
        return account.userID
    }
    else
    {
        console.log("account NOT found")
        return ""
    }
}
async function logout(token)
{
    let decoded_token = jwt.decode(token)
    let expirationDate = moment.unix(decoded_token.exp).utc()
    // You can format the date however you like
    expirationDate = expirationDate.format('YYYY-MM-DD, HH:mm:ss');
    //BLACKLISTED TOKENS COLLECTION
    const blt_collection = client.db("mediaPlatform").collection("BLACKLISTED_TOKENS")
    //check if token is valid
    let valid_token = verify_token(token)

    //blacklists the token by inserting it into the blacklisted database
    const blacklisted_token = await blt_collection.insertOne({
            "token": token,
            "expiration": expirationDate
        })
    return true

}
//checks if token is valid and not blacklisted
async function verify_token(token)
{
    //verifies the token against the secret key
    try {
        const verified = jwt.verify(token, JWTKey)
        //check if token is blacklisted
        const blt_collection = client.db("mediaPlatform").collection("BLACKLISTED_TOKENS")
        const blacklisted_token = await blt_collection.findOne({
            "token": token
        })
        return !blacklisted_token && verified;
    }
    catch (e) {
        console.log("token is not valid")
        console.error(e)
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
async function getUploads(userID)
{
    const uploadsCollection = client.db("mediaPlatform").collection("UPLOADS")
    let uploads = await uploadsCollection.find({userID: userID}).toArray()
    return uploads
}

module.exports = {login, logout, upload, getUploads, verify_token}