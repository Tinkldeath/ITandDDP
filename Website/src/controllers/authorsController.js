const userModel = require('./../data/models/userModel');
const path = require('path');
const keys = require('./../config/keys');

module.exports.authors = async function(req, res) {
    const users = await userModel.find({});
    document = {
        authors: []
    }
    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        let imageUrl = '';
        if(user.imageUrl) {
            imageUrl = `http://${keys.host}:${keys.port}/api/images/` + (user.imageUrl.replace('/uploads/', ''))
        } else {
            imageUrl = `http://${keys.host}:${keys.port}/api/images/duck.png`
        }
        document.authors.push({
            _id: user._id,
            name: user.username,
            imageUrl: imageUrl,
            topRated: user.topRated,
            posts: user.posts.length,
            friends: user.friends.length
        });
    }
    res.status(200).json(document);
};

module.exports.user = async function(req, res) {
    try {
        const id = req.userId;
        if(!id) {
            return res.status(200).json({id: 'Unauthorized'});
        } else {
            const user = await userModel.findOne({_id: id});
            let imageLink;
            if(user.imageUrl){
                imageLink = `http://${keys.host}:${keys.port}/api/images/` + user.imageUrl.replace('/uploads/', '');
                return res.status(200).json({ id: user._id, name: user.username, imageLink: imageLink });
            }
            return res.status(200).json({ id: user._id, name: user.username });
        }
    } catch(error) {
        console.log(error);
    }
}