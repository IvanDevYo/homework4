const fs = require('fs')
const path = require('path')

const args = JSON.parse(process.env.npm_config_argv)
let pathInputVariable = '.'

args.original.forEach(param => {
    if (param.includes('path')) {
        const startIndex = param.indexOf('=') + 1
        const endIndex = param.length
        pathInputVariable = param.slice(startIndex, endIndex);
    }
})

const normalizedPath = path.normalize(pathInputVariable)
let dirs = [normalizedPath]

let tree = {
    files: [],
    dirs: [],
}

dirTree()

async function dirTree () {
    do {
        let pathForRead = dirs[0]
        if (dirs[0] !== normalizedPath) path.join(normalizedPath, pathForRead)

        const objects = await fs.promises.readdir(dirs[0])

        tree.files = tree.files.concat(getFiles(objects, dirs[0]))

        let actualDirs = getDirectories(objects, dirs[0])
        tree.dirs = tree.dirs.concat(actualDirs)

        dirs.splice(0, 1)
        dirs = dirs.concat(actualDirs)

        if (!dirs.length) console.log(JSON.stringify(tree, true, 2))
    } while (dirs.length)
}


function getFiles(objects, normalizedPath) {
    return objects.map(object => {
        return path.join(normalizedPath, object)
    }).filter(filteredObject => {
        return fs.lstatSync(filteredObject).isFile()
    })
}

function getDirectories(objects, normalizedPath) {
    return objects.map(object => {
        return path.join(normalizedPath, object)
    }).filter(filteredObject => {
        return fs.lstatSync(filteredObject).isDirectory()
    })
}