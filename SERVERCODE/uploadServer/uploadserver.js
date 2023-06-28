const express = require("express")
const fs = require('fs')
const rl = require('readline');
const multer = require('multer');
const cors = require('cors');
const busboy = require('busboy');
const bodyParser = require("body-parser");
const path = require("path");


const app = express();
const upload = multer();
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

    app.listen(8000)
console.log("server started")