const {
    readdir,
    stat,
    createWriteStream,
    readFile,
    writeFile,
    mkdir,
    rmdir,
    unlink,
    constants,
    copyFile
} = require('fs');
const {
    join
} = require('path');

function clearDir(path) {
    readdir(path, (err, files) => {
        if (!files) return;

        for (const file of files) {
            stat(join(path, file), (err, data) => {
                if (!data) return;

                if (data.isFile()) {
                    unlink(join(path, file), err => {
                        if (err) throw err;
                    });


                } else {
                    clearDir(join(path, file))
                }

            })
        }

    })

}

function copyDir(entryDir, distDir = '') {


    readdir(join(__dirname, distDir, entryDir), (err, files) => {

        if (!files) return;
        for (let el of files) {
            stat(join(__dirname, distDir, entryDir, el), (err, data) => {
                if (!data.isFile()) {
                    clearDir(join(__dirname, distDir, entryDir, el));

                } else {
                    unlink(join(__dirname, distDir, entryDir, el), err => {
                        if (err) console.log(err)
                    });
                }
            })
        }

    })

    rmdir(join(__dirname, distDir, entryDir), {
        recursive: true
    }, err => {
        cpDir(entryDir, distDir)
    })

    function cpDir(entryDir, distDir = '') {

        readdir(join(__dirname, entryDir), (err, cfiles) => {
            if (!cfiles) return;

            mkdir(join(__dirname, distDir, entryDir), {
                recursive: true
            }, (err) => {
                if (err) throw err;
            });

            for (const file of cfiles) {
                stat(join(__dirname, entryDir, file), (err, data) => {
                    if (err) throw err;

                    if (data.isFile()) {
                        copyFile(join(__dirname, entryDir, file), join(__dirname, distDir, entryDir, file), constants.COPYFILE_FICLONE, (err) => {
                            if (err) console.error(err);
                        })
                    } else {
                        cpDir(join(entryDir, file), distDir);
                    }
                })
            }
        })
    }
    cpDir(entryDir, distDir)
}

function joinStyles(entryDir, distDir, destFileName = 'style.css') {
    writeFile(join(distDir, destFileName), '', (err) => {
        if (err) throw err
    })

    let bundleData = createWriteStream(join(distDir, destFileName), {
        flags: 'a'
    });
    readdir(entryDir, 'utf8', (err, files) => {
        if (err) throw err;

        for (let file of files) {
            let ext = file.split('.')[1];
            stat(join(entryDir, file), (err, data) => {
                if (err) throw err;
                if (data.isFile() && ext == 'css') {
                    readFile(join(entryDir, file), 'utf-8', (err, fdata) => {
                        if (err) throw err;
                        bundleData.write('\n' + fdata)
                    })
                }
            })
        }
    })
}

let getTemplate = (str, comp, name) => {
    const regex = new RegExp(`{{( *)${name}( *)}}`);
    str = str.replace(regex, comp);
    return str;
}

function createDistHtml(distDir, templateFile = 'template.html', distFileName = 'index.html') {
    mkdir(distDir, {
        recursive: true
    }, (err) => {
        if (err) throw err
    })

    readFile(join(__dirname, templateFile), 'utf-8', (err, tdata) => {
        if (err) throw err;
        readdir(join(__dirname, 'components'), 'utf-8', (err, files) => {
            let str = tdata;
            for (let file of files) {
                let [name, ext] = file.split('.');
                stat(join(__dirname, 'components', file), (err, stats) => {
                    if (stats.isFile() && ext == 'html') {
                        readFile(join(__dirname, 'components', file), 'utf-8', (err, sdata) => {
                            if (err) throw err;
                            str = getTemplate(str, sdata, name);
                            setTimeout(() => {
                                writeFile(join(distDir, distFileName), str, (err) => {
                                    if (err) throw err
                                })
                            }, 100)
                        })
                    }
                })
            }
        })
    })
}

function showEnd(){
    console.log("\x1b[32m", `Your project has been built!\n project-dist:\n  assets\n  styles.css\n  index.html`, '\x1b[0m')
}

createDistHtml(join(__dirname, 'project-dist'))
joinStyles(join(__dirname, 'styles'), join(__dirname, 'project-dist'))
copyDir('assets', join('project-dist'))
showEnd()