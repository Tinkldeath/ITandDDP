const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    members: [ { type: Schema.Types.ObjectId, required: true } ],
    messages: [ { type: Schema.Types.ObjectId, required: true } ]
});

module.exports = mongoose.model('Chat', schema, 'chats');
