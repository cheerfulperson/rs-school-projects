const { readdir, stat } = require('fs');
const { join } = require('path');

readdir(join(__dirname, 'secret-folder'), 'utf-8', (err, files) => {
    if (err) console.error("\x1b[31m", err,'\x1b[0m');
    for(let file of files){
        let [name, ext] = file.split('.');
        stat(join(__dirname, 'secret-folder', file), (err, data) => {
            if(data.isFile())
                console.log("\x1b[32m", `${name} - ${ext} - ${data.size / 1024} kb`,'\x1b[0m')
        })
    }
})

