const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    sender: { type: 'ObjectId', ref: 'User' },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now },
    edited: { type: Boolean, required: true },
    dateEdited: { type: Date }
});

module.exports = mongoose.model('Message', schema, 'messages');
