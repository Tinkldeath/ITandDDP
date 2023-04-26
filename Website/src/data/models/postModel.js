const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    owner: { type: Schema.Types.ObjectId, required: true },
    title: { type: String, required: true },
    date: { type: Date, default: Date.now },
    artworkUrl: { type: String, required: true},
    category: { type: Schema.Types.ObjectId, required: true },
    style: {type: String, required: true},
    technique: {type: String, required: true},
    genre: {type: String, required: true},
    likes: [ { type: Schema.Types.ObjectId, required: true } ],
    comments: [ { type: Schema.Types.ObjectId, required: true } ],
    inTop: {type: Boolean, required: true}
});

module.exports = mongoose.model('Post', schema, 'posts');
