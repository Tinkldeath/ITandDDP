const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    login: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    username: {type: String, required: true},
    imageUrl: {type: String, required: false},
    topRated: {type: Boolean, required: true},
    friends: [Schema.Types.ObjectId],
    posts: [Schema.Types.ObjectId],
    chats: [Schema.Types.ObjectId],
    friend_requests: [Schema.Types.ObjectId]
});

module.exports = mongoose.model('User', schema, 'users');
