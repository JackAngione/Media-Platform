const express = require("express")
const {JWTKey} = require("../secret_keys")
const cors = require('cors');
const db = require("./mongoDBFuncitons.js")
const jwt = require('jsonwebtoken');
const {expressjwt: eJWT} = require("express-jwt");
const {response} = require("express");



//JWT SECRET KEY
const secretKey = JWTKey;
const port = 3000
const app = express()
app.use(cors());
app.use(express.json());

// JWT validation
async function verifyToken(req) {
    //console.log("verifying jwt")
    // If expressJwt middleware does not throw an error, the token is valid
    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1]; // Bearer <token>
    return await db.verify_token(token);
}
//create account
app.post('/api/createAccount', async (req, res) => {
    console.log("creating account")
    //returns true if account successfully created, false if not
    let new_user = await db.createAccount(req.body)
    //successfully created user
    if(new_user)
    {
        res.status(201).send()
    }
    else
    {
        //send status 409 to indicate email is taken
        console.log("sending 409 error")
        res.status(409).send()
    }
})

//user login
app.post('/api/login', async (req, res) => {
    console.log("login request made")
    let user_id = await db.login(req.body)
    if(user_id !== "")
    {
        console.log("login:" + user_id)
        //sign JWT with user_id, returned from login function
        const token = jwt.sign({ user_id: user_id}, secretKey, {
            expiresIn: '1h' // Token expires in 1 hour
        });
        res.send({ token });
    }
    else
    {
        //TODO RETURN ERROR NO LOGIN
        // User is not authenticated
        res.status(401).send('Invalid credentials');
    }
})
//user logout
app.post('/api/logout', async (req, res) => {
    console.log("logout request made")
    let tokenValid = await verifyToken(req)
    if(tokenValid)
    {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>
        let logout = await db.logout(token)
        //returns 201 if successful, 500 if there was a server/database error blacklisting the token
        return logout
    }
    else
    {
        //token was not valid, so logout anyway
        console.log("sending 401 status")
        res.status(401).send()

    }
})


//upload a file to the database
app.post('/api/upload', async (req, res) => {
    if(await verifyToken(req))
    {
        console.log("upload request made")
        let upload_id = await db.upload(req.body)
        console.log("successful upload! upload_id = " + upload_id)
        res.send({upload_id: upload_id})
    }
})
//get all uploads of a specific user
app.get('/api/userUpoads', async (req, res) => {
    const user_id = req.query.user_id
    console.log("user_id = " + user_id)
    let uploads = await db.getUploads(user_id)
    res.send(uploads)
    //let login = await db.login(req.body)
})
//get profile information for a user
app.get('/api/user/:user_id', async (req, res) => {
    const user_id = req.params.user_id
    console.log("user_id = " + user_id)
    let profile = await db.getProfile(user_id)
    let uploads = await db.getUploads(user_id)
    let final_profile = {"profile": profile, "uploads": uploads}
    res.send(final_profile)
})
//change account details
app.post('/api/editAccount', async (req, res) => {
    //verificationCheck
    if(await verifyToken(req))
    {
        //after token is verified,
        //get user_id from token
        const authHeader = req.headers['authorization'];
        const token = authHeader.split(' ')[1]; // Bearer <token>
        const decoded_token = jwt.decode(token)
        //get user_id from decoded token
        const user_id = decoded_token.user_id

        let editStatus = await db.editAccount(user_id, req.body)
        console.log("returning code: " + editStatus)
        res.status(editStatus).send()
        //console.log("successfully edited " + user_id + " account")
    }
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})