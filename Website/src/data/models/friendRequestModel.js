const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    sender: { type: Schema.Types.ObjectId, required: true },
    reciever: { type: Schema.Types.ObjectId, required: true }
});

module.exports = mongoose.model('FriendRequest', schema, 'friendRequests');
