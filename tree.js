const fs = require('fs')
const path = require('path')

const pathInputVariable = process.env.npm_config_path
const normalizedPath = path.normalize(pathInputVariable)

let tree = {
    files: [],
    dirs: [],
}

console.log(normalizedPath)

fs.promises.readdir(normalizedPath).then(objects => {

    tree.files = objects.map(object => {
        return path.normalize(path.join(normalizedPath, object))
    }).filter(filteredObject => {
        return fs.lstatSync(filteredObject).isFile()
    })

    tree.dirs = objects.map(object => {
        return path.normalize(path.join(normalizedPath, object))
    }).filter(filteredObject => {
        return fs.lstatSync(filteredObject).isDirectory()
    })

    console.log(tree)
}).catch(error => {
    console.error(error)
})