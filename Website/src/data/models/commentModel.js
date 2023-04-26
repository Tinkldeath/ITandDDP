const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    author: { type: Schema.Types.ObjectId, required: true },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', schema, 'comments');
