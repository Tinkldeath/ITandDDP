const categoryModel = require('./../data/models/categoryModel');
const postModel = require('./../data/models/postModel');
const keys = require('./../config/keys');

module.exports.categories = async function(req, res) {
    const categories = await categoryModel.find({});
    let docs = {
        categories: []
    };
    for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        const posts = await postModel.find({category: category._id})
        docs.categories.push({
            _id: category._id,
            title: category.title,
            description: category.description,
            imageUrl: `http://${keys.host}:${keys.port}/api/images/` + category.imageUrl.replace('/uploads/', ''),
            artworks: posts.length
        })
    }
    res.status(200).json(docs);
};