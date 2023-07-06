const express = require("express")
const fs = require('fs')
const multer = require('multer');
const cors = require('cors');
const path = require("path");


const app = express();

const upload = multer();
app.use(express.json())
//app.use(bodyParser.raw({type: "application/octet-stream", limit: "200mb"}))
app.use(cors({origin: "http://localhost:1420"}));

app.post("/upload", upload.array('chunk', 1), async (req, res) => {
    console.log("connected")
    const chunk = req.files[0].buffer;
    const chunkNumber = req.body.chunkNumber;
    const totalChunks = req.body.totalChunks;
    const fileName = req.files[0].originalname;
    const chunkPath = path.resolve("./uploads", 'chunks', `${fileName}`);
    console.log(chunk)
    console.log("name: " + fileName)
    console.log("chunkNumber: " + chunkNumber)
    console.log("totalChunks: " + totalChunks)

    if (!fs.existsSync(path.resolve("./uploads", 'chunks')))
    {
        fs.mkdirSync(path.resolve("./uploads", 'chunks'));
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
    //const chunkSize = 100 * 1024 * 1024; // 100MB in bytes
    const chunkSize = 100 * 1024 * 1024; // 100MB in bytes
    let chunk_data = ""
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
    //console.log("DATA: " + chunk_data)
    readStream.on('end', function() {
        //res.send(chunk_data)
        console.log('sent chunk: ' + currentChunk);
    });
    //res.send("sent: " + JSON.stringify(req.body))
})

//returns the total chunk count needed to completely download a file
app.post("/getChunkCount", async (req, res) => {
    //console.log("CURRENT DIRECTORY: " + path.resolve(process.cwd(), '..', '..'));
    let uploadID = req.body.uploadID
    let userID =  req.body.userID

    const chunkSize = 100 * 1024 * 1024; // 100MB in bytes


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