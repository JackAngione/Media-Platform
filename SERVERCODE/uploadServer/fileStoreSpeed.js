const fs = require('fs')
let chunkSize = 100000 *1024
let chunk = '';
let readStream = fs.createReadStream("JILVID.mp4", {highWaterMark: chunkSize})

let writeStream = fs.createWriteStream("./uploads/JILVID.mp4", {highWaterMark: chunkSize, flags: 'a'})


readStream.on('data', (data) => {
    chunk += data.toString();

    while (chunk.length >= chunkSize) {
        console.log("writing Chunk")
        writeStream.write(chunk.slice(0, chunkSize));
        chunk = chunk.slice(chunkSize);
    }
});

readStream.on('end', () => {
    if (chunk.length > 0) {
        writeStream.write(chunk);
    }
    writeStream.end();
});