const path = require('path');

module.exports.portal = async function(req, res) {
    res.sendFile(path.resolve('src/frontend/pages/index.html'));
};

module.exports.newPost = async function(req, res) {
    res.sendFile(path.resolve('src/frontend/pages/addPost.html'));
}