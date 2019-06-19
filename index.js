fs = require('fs');
path = require('path');
const pathDir = __dirname + '/nearest_neighbors'
const datastore = require('nedb')

const db = new datastore('./database/database.db')
db.loadDatabase()

const extractor = (error, files) => {
    if (error) process.exit(1);

    files.forEach(file => {
        // console.log(file)
        let fromPath = path.join(pathDir, file)
        // console.log(fromPath)

        const fileId = file.replace('.json', '')
        let dbItem = {
            _id: fileId,
            fileName: file,
            neighbors: {}
        }
        fs.readFile(fromPath, (err, data) => {
            dbItem.neighbors = JSON.parse(data).filter((item, index) => {
                return item.filename !== fileId
            }) //first item its self, has similarity 1
            db.insert(dbItem)
            console.log(fileId)
        })
    });
}

fs.readdir(pathDir, extractor)