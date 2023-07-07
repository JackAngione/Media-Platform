const express = require("express")
const {JWTKey} = require("./mongoDBconnection")
const cors = require('cors');
const db = require("./mongoDBFuncitons.js")
const jwt = require('jsonwebtoken');
var { expressjwt: eJWT } = require("express-jwt");
const {serialize} = require("mongodb");

//JWT SECRET KEY
const secretKey = JWTKey;
const port = 3000
const app = express()
app.use(cors());
app.use(express.json());
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {  // expressJwt throws UnauthorizedError for invalid tokens
        res.send({ isValid: false });
    }
});
//user login
app.post('/api/login', async (req, res) => {
    console.log("login request made")
    let user_id = await db.login(req.body)
    if(user_id !== "")
    {
        console.log("login:" + user_id)
        //sign JWT with userID, returned from login function
        const token = jwt.sign({ id: user_id}, secretKey, {
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
// JWT validation
app.get('/api/validate', eJWT({ secret: secretKey, algorithms: ['HS256'] }), (req, res) => {
    // If expressJwt middleware does not throw an error, the token is valid
    res.send({ isValid: true });
});



//upload a file to the database and file server
app.post('/api/upload', eJWT({secret: secretKey, algorithms: ["HS256"]}), async (req, res) => {
    console.log("upload request made")
    let login = await db.upload(req.body)
    console.log("successful upload!")
})
//get all uploads of a specific user
app.get('/api/userUpoads', async (req, res) => {
    const userID = req.query.userID
    console.log("userID = " + userID)
    let uploads = await db.getUploads(userID)
    res.send(uploads)
    //let login = await db.login(req.body)
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})