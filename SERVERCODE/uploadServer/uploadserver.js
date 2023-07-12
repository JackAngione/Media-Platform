const express = require("express")
const fs = require('fs')
const multer = require('multer');
const cors = require('cors');
const path = require("path");

const app = express();
const upload = multer();

app.use(express.json())
app.use(cors({origin: "http://localhost:1420"}));

const chunkSize = 10 * 1024 * 1024; // 100MB in bytes

app.post("/upload", upload.array('chunk', 1), async (req, res) => {
    console.log("connected")
    const chunk = req.files[0].buffer;
    const upload_id = req.body.upload_id
    const user_id = req.body.user_id
    const chunkNumber = req.body.chunkNumber;
    const totalChunks = req.body.totalChunks;
    const fileName = req.files[0].originalname;
    console.log("userid: " + user_id + " upload_id: " + upload_id)
    const chunkPath = `../../ServerFiles/USERS/${user_id}/UPLOADS/${upload_id}`;
    console.log("path: " + chunkPath)
    ///console.log(chunk)
    console.log("name: " + fileName)
    console.log("chunkNumber: " + chunkNumber)
    console.log("totalChunks: " + totalChunks)

    //create the user's upload folder if it doesn't exist
    if (!fs.existsSync(`../../ServerFiles/USERS/${user_id}/UPLOADS/`))
    {
        fs.mkdirSync(`../../ServerFiles/USERS/${user_id}/UPLOADS/`, { recursive: true });
    }


    let writeStream = fs.createWriteStream(chunkPath, {flags: "a"})
    await Promise.all([
        new Promise(resolve => writeStream.once('open', resolve)),
    ]);
    console.log("writing chunk")
    writeStream.write(chunk);
    console.log("DONE writing chunk")
    writeStream.close()
    await new Promise(resolve => writeStream.once('close', resolve));

    console.log(`Chunk ${chunkNumber} saved`);
    if (chunkNumber === (totalChunks)) {

        return res.status(200).send({message: 'Chunk saved'});
    }
    res.send("good")
})

app.post("/download", async (req, res) => {
    let uploadID = req.body.uploadID
    let userID =  req.body.userID
    let currentChunk = req.body.needed_chunk

    let chunkStart = chunkSize * currentChunk
    const chunkEnd = chunkStart + chunkSize
    if(currentChunk>=1)
    {
        chunkStart = chunkStart+1
    }
    console.log("sending bytes: " + chunkStart + " to " + chunkEnd)

    //open File
    const readStream = fs.createReadStream(`../../ServerFiles/USERS/${userID}/UPLOADS/${uploadID}`, {start: chunkStart, end: chunkEnd });
    readStream.on('open', function(chunk) {
        readStream.pipe(res);

    });

    readStream.on('end', function() {
        console.log('sent chunk: ' + currentChunk);
    });

})

//returns the total chunk count needed to completely download a file
app.post("/getChunkCount", async (req, res) => {
    //console.log("CURRENT DIRECTORY: " + path.resolve(process.cwd(), '..', '..'));
    let uploadID = req.body.uploadID
    let userID =  req.body.userID

    let fileSize = fs.statSync(`../../ServerFiles/USERS/${userID}/UPLOADS/${uploadID}`).size;
    console.log("file size: " + fileSize)

    //calculate how many chunks will need to be sent
    let chunkCount = Math.ceil(fileSize/chunkSize)
    //send it as json
    console.log("total chunks: " + chunkCount)
    res.json({total_chunks: chunkCount-1, chunk_data: ""})
})

app.listen(8000)
console.log("server started")