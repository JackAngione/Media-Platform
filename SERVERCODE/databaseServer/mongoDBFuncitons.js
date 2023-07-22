const {connectionString, meiliSearch_Master_Key} = require("../secret_keys")
const { MongoClient } = require('mongodb');
const crypto = require('crypto');
const { format } = require('date-fns');
const { utcToZonedTime } = require('date-fns-tz');
const jwt = require('jsonwebtoken');
const {JWTKey} = require("../secret_keys")
const client = new MongoClient(connectionString)
const moment = require('moment');
const { MeiliSearch } = require('meilisearch')


const meili_client = new MeiliSearch({
    host: 'http://0.0.0.0:7700',
    apiKey: meiliSearch_Master_Key
})
//get current UTC formatted date and time "YYYY-MM-DD
function getDateTime() {
    const now = new Date();
    const utcDate = utcToZonedTime(now, 'Etc/UTC');
    return format(utcDate, 'MM-dd-yyyy, HH:mm:ss');
}
//GENERATE USER_ID for a new user
async function generateUserID() {
    const userCollection = client.db("mediaPlatform").collection("USERS")
    let user_ID = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    const charactersLength = characters.length;
    let repeatCheck = 1
    while(repeatCheck > 0)
    {
        user_ID = ""
        for (let i = 0; i < 7; i++) {
            user_ID += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        repeatCheck = await userCollection.countDocuments({user_id: user_ID})
        console.log("repeat check" + repeatCheck)
    }
    return user_ID
}
//GENERATES A VIDEO_ID FOR AN UPLOAD
async function generateVideoID(user_id) {
    const uploadsCollection = client.db("mediaPlatform").collection("UPLOADS")
    let upload_ID = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    const charactersLength = characters.length;
    let repeatCheck = 1
    while(repeatCheck > 0)
    {
        upload_ID = ""
        for (let i = 0; i < 7; i++) {
            upload_ID += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        repeatCheck = await uploadsCollection.countDocuments({user_id: "xxxxxxx", uploadID: upload_ID})
        console.log("repeat check" + repeatCheck)
    }
    return upload_ID
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
    const fileTypes = {"wav": "audio", "mp3": "audio", "aac": "audio", "flac": "audio",
        "mp4": "video", "mkv": "video", "mov": "video",
        "jpg": "photo", "png": "photo", "tiff": "photo"}
    return fileTypes[extension]
}

//createa account
async function createAccount(userInfo)
{
    //console.log("email:" + credentials.email)
    const hashed_password = sha256Hash(userInfo.password)
    const user_id = await generateUserID()
    const creation_date = moment.utc().format('YYYY-MM-DD, HH:mm:ss');

    //CHECK IF EMAIL IS ALREADY IN USE
    const usersCollection = client.db("mediaPlatform").collection("USERS")
    const account = await usersCollection.findOne({"email": userInfo.email})
    //if account with provided email already exists
    if(account)
    {
        //email already exists
        console.log("email already exists")
        return false
    }

    else
    {

        //insert new account into database
        await usersCollection.insertOne({
            "user_id": user_id,
            "username": userInfo.username,
            "email": userInfo.email,
            "password": hashed_password,
            "creationDate": creation_date
        })
        let user_index = meili_client.index("users")
        await user_index.addDocuments([{
            user_id: user_id, username: userInfo.username
        }]);
        return true
    }

}
//login
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
        return account.user_id
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

    try {
        //BLACKLISTED TOKENS COLLECTION
        const blt_collection = client.db("mediaPlatform").collection("BLACKLISTED_TOKENS")
        //blacklists the token by inserting it into the blacklisted database
        await blt_collection.insertOne({
            "token": token,
            "expiration": expirationDate
        })
        return 201
    } catch (e) {
        //there was a server/database error logging out
        return 501
    }


}
//checks if token is valid and not blacklisted
async function verify_token(token)
{
    //verifies the token against the secret key
    try {
        //console.log("JWT TOKEN IS: " + token)
        const verified = jwt.verify(token, JWTKey)
        const currentTime = Math.floor(Date.now() / 1000); // Get current time in seconds
        /*
        //Calculate time left in seconds
        const timeLeft = verified.exp - currentTime;
        if (timeLeft > 0) {
            console.log("Token will expire in: ", timeLeft, " seconds.");
            console.log("Token will expire in: ", Math.floor(timeLeft / 60), " minutes.");
            console.log("Token will expire in: ", Math.floor(timeLeft / 60 / 60), " hours.");
        } else {
            console.log("Token has expired.");
        }

        */
        //console.log('JWT will expire at: ', new Date(verified.exp * 1000));

        //check if token is blacklisted
        const blt_collection = client.db("mediaPlatform").collection("BLACKLISTED_TOKENS")
        const blacklisted_token = await blt_collection.findOne({
            "token": token
        })
        //console.log("token is valid!")
        return !blacklisted_token && verified;
    }
    catch (e) {
        //console.log("token is not valid")
        //console.error(e)
        return false
    }

}
//add an upload to the database
async function upload(upload)
{
    const uploadsCollection = client.db("mediaPlatform").collection("UPLOADS")
    const upload_id = await generateVideoID(upload.userID)
    const uploadDocument = {
        user_id: upload.user_id,
        uploadID: upload_id,
        originalFilename: upload.originalFilename,
        fileType: getFileType(upload.fileType),
        fileSize: upload.fileSize,
        title: upload.title,
        description: upload.description,
        uploadDate: getDateTime()
    }
    await uploadsCollection.insertOne(uploadDocument);
    return upload_id
}
//get all uploads for a specific user
async function getUploads(userID)
{
    const uploadsCollection = client.db("mediaPlatform").collection("UPLOADS")
    return await uploadsCollection.find({userID: userID}).toArray()
}
//get a user's profile information
async function getProfile(user_id)
{
    const uploadsCollection = client.db("mediaPlatform").collection("USERS")
    let full_profile = await uploadsCollection.findOne({user_id: user_id})

    let profile = {"username": full_profile.username, "email": full_profile.email, "creationDate": full_profile.creationDate}
    return profile;
}
//returns status code depending on if account edit is successful
async function editAccount(user_id, new_info)
{

    const uploadsCollection = client.db("mediaPlatform").collection("USERS")
    //TODO CHECK IF "OLD PASSWORD" IS THE SAME AS EXISTING PASSWORD
    //console.log("fetching " + user_id + " document")
    let oldAccount = await uploadsCollection.findOne({user_id: user_id})
    if(new_info.hasOwnProperty("password"))
    {
        let hashed_old_password = sha256Hash(new_info.old_password)
        //check if provided "original password" matches the one currently in database
        if(oldAccount.password === hashed_old_password)
        {
            //passwords are correctS
            delete new_info.old_password
            //hash incoming password before updating it
            new_info.password = sha256Hash(new_info.password)
        }
        else
        {
            //passwords do not match!
            return 400
        }
    }
    try{
        //console.log("user_id to upldate: " + user_id)
        //console.log("new info: " + JSON.stringify(new_info))
        //update user's document in database
        await uploadsCollection.updateOne({user_id: user_id}, {$set: new_info})
        //successfully updated account in database

        //if username is changed, also add change to meilisearch
        if(new_info.hasOwnProperty("username"))
        {
            let user_index = meili_client.index("users")
            await user_index.updateDocuments([{
                user_id: user_id,
                username: new_info.username
            }]);
        }
        return 201
    } catch (e) {
        //error updating database
        return 500
    }

}
module.exports = {createAccount, login, logout, upload, getUploads, getProfile, editAccount, verify_token}