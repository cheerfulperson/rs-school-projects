const {
    copyFile,
    mkdir,
    readdir,
    unlink,
    constants
} = require('fs');
const {
    join
} = require('path');

function copyDir(dir) {
    mkdir(join(__dirname, dir + '-copy'), {
        recursive: true
    }, (err) => {
        if (err) throw err;
    });
    readdir(join(__dirname, dir), (err, cfiles) => {
        if (err) throw err;
        readdir(join(__dirname, dir + '-copy'), (err, files) => {
            if (err) throw err;
            for (const file of files) {
                unlink(join(__dirname, dir + '-copy', file), err => {
                    if (err) throw err;
                });
            }
            for (const file of cfiles) {
                copyFile(join(__dirname, dir, file), join(__dirname, dir + '-copy', file), constants.COPYFILE_FICLONE, (err) => {
                    if (err) throw err;
                })
            }
            console.log("\x1b[32m", `Files has been copied!`, '\x1b[0m')
        })
        
    })
}

copyDir('files')