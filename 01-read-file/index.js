const { ReadStream }= require('fs');
const { join } = require('path');

let stream = new ReadStream(join(__dirname, 'text.txt'));

stream.on('data', (data) => {
    console.log("\x1b[32m", data.toString('utf-8'),'\x1b[0m');
})
