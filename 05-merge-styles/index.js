const { readdir, stat, createWriteStream, readFile, writeFile } = require('fs');
const { join } = require('path');

function joinStyles(entryDir, distDir, destFileName = 'bundle.css'){
    writeFile(join(distDir, destFileName), '' ,(err) => {if(err) throw err})

    let bundleData = createWriteStream(join(distDir, destFileName), {flags: 'a'});
    readdir(entryDir, 'utf8', (err, files) => {
        if (err) throw err;

        for(let file of files){
            let ext = file.split('.')[1];
            stat(join(entryDir, file), (err, data) => {
                if (err) throw err;
                if(data.isFile() && ext == 'css'){
                    readFile(join(entryDir, file), 'utf-8', (err, fdata) => {
                        if (err) throw err;
                        bundleData.write('\n' + fdata)
                    }) 
                }       
            })
        }
        console.log("\x1b[32m", `Styles has been merged!`, '\x1b[0m')
    })
}

joinStyles(join(__dirname, 'styles'), join(__dirname, 'project-dist'))