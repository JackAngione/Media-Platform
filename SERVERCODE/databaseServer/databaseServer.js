const express = require("express")
const cors = require('cors');
const db = require("./mongoDBaccess.js")

const port = 3000
const app = express()
app.use(cors());
app.use(express.json());

//user login
app.post('/api/login', async (req, res) => {
    console.log("login request made")
    let login = await db.login(req.body)
    console.log("login:" + login)
    res.json({success: true})
})

app.post('/api/upload', async (req, res) => {
    console.log("upload request made")
    let login = await db.upload(req.body)
    console.log("successful upload!")
})

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