const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    members: [ { type: 'ObjectId', ref: 'User'} ],
    messages: [ { type: 'ObjectId', ref: 'Message'} ]
});

module.exports = mongoose.model('Chat', schema, 'chats');
