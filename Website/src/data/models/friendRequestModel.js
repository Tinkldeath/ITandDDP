const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    sender: { type: 'ObjectId', ref: 'User' },
    reciever: { type: 'ObjectId', ref: 'User' }
});

module.exports = mongoose.model('FriendRequest', schema, 'friendRequests');
