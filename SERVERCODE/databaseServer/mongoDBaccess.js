const {connectionString} = require("./mongoDBconnection")
const { MongoClient } = require('mongodb');
const crypto = require('crypto');

const client = new MongoClient(connectionString)

function sha256Hash(input) {
    const hash = crypto.createHash('sha256');
    hash.update(input);
    return hash.digest('hex');
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


module.exports = {login}