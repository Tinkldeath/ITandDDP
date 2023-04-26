const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    owner: { type: 'ObjectId', ref: 'User' },
    title: { type: String, required: true },
    date: { type: Date, default: Date.now },
    artworkUrl: { type: String, required: true},
    category: { type: 'ObjectId', ref: 'Category' },
    style: {type: String, required: true},
    technique: {type: String, required: true},
    genre: {type: String, required: true},
    likes: [ { type: 'ObjectId', ref: 'User' } ],
    comments: [ { type: 'ObjectId', ref: 'User' } ]
});

module.exports = mongoose.model('Post', schema, 'posts');
