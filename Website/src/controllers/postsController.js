const keys = require('./../config/keys');
const postModel = require('./../data/models/postModel');
const userModel = require('./../data/models/userModel');
const categoryModel = require('./../data/models/categoryModel');
const commentModel = require('./../data/models/commentModel');

function comparePosts(post1, post2) {
    if (post1.likes.length < post2.likes.length) {
        return -1;
    }
    if (post1.likes.length > post2.likes.length) {
    return 1;
    }
    return 0;
}

module.exports.posts = async function(req, res) {
    const posts = await postModel.find({});
    let document = {
        posts: []
    }
    for (let i = 0; i < posts.length; i++) {
        const post = posts[i];
        const user = await userModel.findById(post.owner);
        const category = await categoryModel.findById(post.category);
        let comments = [];
        for (let j = 0; j < post.comments.length; j++) {
            const comment = array[j];
            const author = await userModel.findById(comment.author);
            comments.push({
                _id: comment._id,
                author: author.username,
                content: comment.content,
                date: comment.date
            });
        }
        document.posts.push({
            _id: post._id,
            title: post.title,
            author: user.username,
            authorUrl: `http://${keys.host}:${keys.port}/api/authors/${user._id}`,
            authorImageUrl: `http://${keys.host}:${keys.port}/api/images/${user.imageUrl.replace('/uploads/', '')}`,
            imageUrl: `http://${keys.host}:${keys.port}/api/images/${post.imageUrl.replace('/uploads/', '')}`,
            date: post.date,
            category: category.title,
            technique: category.technique,
            genre: category.genre,
            likes: category.likes,
            comments: comments
        });
    }
    res.status(200).json(document);
};

module.exports.top = async function(req, res) {
    const posts = await postModel.find({});
    const sorted = posts.sort(comparePosts);
    const top = sorted.slice(0, 100);
    const others = sorted.slice(100, posts.length);
    for (let i = 0; i < others.length; i++) {
        const post = others[i];
        const author = await userModel.findById(post.owner);
        author.topRated = false
        await author.save()
    }
    let document = {
        posts: [],
        categoryOptions: new Set(),
        techniqueOptions: new Set(),
        styleOptions: new Set(),
        genreOptions: new Set()
    }
    for (let i = 0; i < top.length; i++) {
        const post = top[i];
        const user = await userModel.findById(post.owner);
        user.topRated = true
        await user.save()
        const category = await categoryModel.findById(post.category);
        let comments = [];
        for (let j = 0; j < post.comments.length; j++) {
            const comment = array[j];
            const author = await userModel.findById(comment.author);
            comments.push({
                _id: comment._id,
                author: author.username,
                content: comment.content,
                date: comment.date
            });
        }
        document.posts.push({
            _id: post._id,
            title: post.title,
            author: user.username,
            authorUrl: `http://${keys.host}:${keys.port}/api/authors/${user._id}`,
            authorImageUrl: `http://${keys.host}:${keys.port}/api/images/${user.imageUrl.replace('/uploads/', '')}`,
            imageUrl: `http://${keys.host}:${keys.port}/api/images/${post.imageUrl.replace('/uploads/', '')}`,
            date: post.date,
            category: category.title,
            technique: post.technique,
            genre: post.genre,
            style: post.style,
            likes: post.likes,
            comments: comments
        });
        document.categoryOptions.add(category.title);
        document.genreOptions.add(post.genre);
        document.styleOptions.add(post.style);
        document.techniqueOptions.add(post.technique);
    }
    res.status(200).json(document);
};