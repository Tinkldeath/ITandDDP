const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    title: {type: String, unique: true, required: true},
    description: {type: String, required: true},
    imageUrl: {type: String, required: true}
});

module.exports = mongoose.model('Category', schema, 'categories');
