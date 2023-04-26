const fs = require('fs')
const path = require('path')

module.exports.posts = async function(req, res) {
    const data = fs.readFileSync(path.resolve('src/data/artworks.json'))
    res.json(JSON.parse(data))
};

module.exports.top = async function(req, res) {
    res.send('Top')
};