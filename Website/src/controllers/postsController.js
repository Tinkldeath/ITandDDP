const keys = require('./../config/keys');
const postModel = require('./../data/models/postModel');
const userModel = require('./../data/models/userModel');
const categoryModel = require('./../data/models/categoryModel');
const commentModel = require('./../data/models/commentModel');
const path = require('path');
const fs = require('fs');

function comparePosts(post1, post2) {
    if (post1.likes.length > post2.likes.length) {
        return -1;
    }
    if (post1.likes.length < post2.likes.length) {
    return 1;
    }
    return 0;
}

function newestFirst(post1, post2) {
    if (post1.date > post2.date) {
        return -1;
    }
    if (post1.date < post2.date) {
    return 1;
    }
    return 0;
}

module.exports.posts = async function(req, res) {
    try {
        const posts = (await postModel.find({})).sort(newestFirst);
        let categoryOptions = new Set();
        let techniqueOptions = new Set();
        let styleOptions = new Set();
        let genreOptions = new Set();
        let document = {
            posts: [],
            categoryOptions: [],
            styleOptions: [],
            genreOptions: [],
            techniqueOptions: []
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
                authorId: user._id,
                authorUrl: `http://${keys.host}:${keys.port}/api/authors/${user._id}`,
                authorImageUrl: `http://${keys.host}:${keys.port}/api/images/${user.imageUrl.replace('/uploads/', '')}`,
                imageUrl: `http://${keys.host}:${keys.port}/api/images/${post.artworkUrl.replace('/uploads/', '')}`,
                date: post.date,
                category: category.title,
                technique: post.technique,
                genre: post.genre,
                style: post.style,
                likes: post.likes.length,
                comments: comments
            });
            categoryOptions.add(category.title);
            genreOptions.add(post.genre);
            styleOptions.add(post.style);
            techniqueOptions.add(post.technique);
        }
        categoryOptions.forEach(option => {
            document.categoryOptions.push(option);
        });
        genreOptions.forEach(option => {
            document.genreOptions.push(option);
        });
        styleOptions.forEach(option => {
            document.styleOptions.push(option)
        });
        techniqueOptions.forEach(option => {
            document.techniqueOptions.push(option);
        });
        res.status(200).json(document);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
};

module.exports.top = async function(req, res) {
    try {
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
        let categoryOptions = new Set();
        let techniqueOptions = new Set();
        let styleOptions = new Set();
        let genreOptions = new Set();
        let document = {
            posts: [],
            categoryOptions: [],
            styleOptions: [],
            genreOptions: [],
            techniqueOptions: []
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
                authorId: user._id,
                authorUrl: `http://${keys.host}:${keys.port}/api/authors/${user._id}`,
                authorImageUrl: `http://${keys.host}:${keys.port}/api/images/${user.imageUrl.replace('/uploads/', '')}`,
                imageUrl: `http://${keys.host}:${keys.port}/api/images/${post.artworkUrl.replace('/uploads/', '')}`,
                date: post.date,
                category: category.title,
                technique: post.technique,
                genre: post.genre,
                style: post.style,
                likes: post.likes.length,
                comments: comments
            });
            categoryOptions.add(category.title);
            genreOptions.add(post.genre);
            styleOptions.add(post.style);
            techniqueOptions.add(post.technique);
        }
        categoryOptions.forEach(option => {
            document.categoryOptions.push(option);
        });
        genreOptions.forEach(option => {
            document.genreOptions.push(option);
        });
        styleOptions.forEach(option => {
            document.styleOptions.push(option)
        });
        techniqueOptions.forEach(option => {
            document.techniqueOptions.push(option);
        });
        res.status(200).json(document);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
};

module.exports.addPost = async function(req, res) {
    try {
        const owner = await userModel.findById(req.userId);
        const category = await categoryModel.findOne({title: req.body.category});
        const post = new postModel({
            owner: owner._id,
            title: req.body.title,
            artworkUrl: req.body.imageUrl,
            category: category._id,
            style: req.body.style,
            technique: req.body.technique,
            genre: req.body.genre,
            likes: [],
            comments: [],
            inTop: false
        });
        owner.posts.push(post._id);
        await post.save();
        await owner.save();
        res.sendStatus(201);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
};

module.exports.like = async function(req, res) {
    try {
        const post = await postModel.findById(req.params.id)
        if (post) {
            const index = post.likes.findIndex(like => like.toString() === req.userId)
            if(index > -1) {
                post.likes.splice(index, 1);
                await post.save();
            } else {
                post.likes.push(req.userId);
                await post.save();
            }
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
            res.status(200).json({
                _id: post._id,
                title: post.title,
                author: user.username,
                authorId: user._id,
                authorUrl: `http://${keys.host}:${keys.port}/api/authors/${user._id}`,
                authorImageUrl: `http://${keys.host}:${keys.port}/api/images/${user.imageUrl.replace('/uploads/', '')}`,
                imageUrl: `http://${keys.host}:${keys.port}/api/images/${post.artworkUrl.replace('/uploads/', '')}`,
                date: post.date,
                category: category.title,
                technique: post.technique,
                genre: post.genre,
                style: post.style,
                likes: post.likes.length,
                comments: comments
            });
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

module.exports.archive = async function(req, res) {
    try {
        const postId = req.params.id;
        const post = await postModel.findById(postId);
        const user = await userModel.findById(req.userId);
        if (post && user) {
            const exists = user.archive.filter(post => {
                return post._id.toString() === postId
            })
            if(exists.length > 0) {
                res.status(200).json({message: 'Post archived'});
            } else {
                user.archive.push(post._id);
                await user.save();
                res.status(200).json({message: 'Post archived'});
            }
        } else {
            res.sendStatus(500);
        }
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
}

module.exports.unarchive = async function(req, res) {
    try {
        const postId = req.params.id;
        const post = await postModel.findById(postId);
        const user = await userModel.findById(req.userId);
        if (post && user) {
            const index = user.archive.findIndex(archived => {
                return archived.toString() === post._id.toString()
            })
            user.archive.splice(index, 1);
            await user.save();
            res.status(200).json({message: 'Post unarchived'});
        } else {
            res.sendStatus(500);
        }
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
}

module.exports.getArchive = async function(req, res) {
    try {
        const user = await userModel.findById(req.userId);
        let categoryOptions = new Set();
        let techniqueOptions = new Set();
        let styleOptions = new Set();
        let genreOptions = new Set();
        let document = {
            posts: [],
            categoryOptions: [],
            styleOptions: [],
            genreOptions: [],
            techniqueOptions: []
        }
        if (user) {
            for(let i = 0; i < user.archive.length; i++) {
                const post = await postModel.findById(user.archive[i]);
                const postAuthor = await userModel.findById(post.owner);
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
                    author: postAuthor.username,
                    authorId: postAuthor._id,
                    authorUrl: `http://${keys.host}:${keys.port}/api/authors/${postAuthor._id}`,
                    authorImageUrl: `http://${keys.host}:${keys.port}/api/images/${postAuthor.imageUrl.replace('/uploads/', '')}`,
                    imageUrl: `http://${keys.host}:${keys.port}/api/images/${post.artworkUrl.replace('/uploads/', '')}`,
                    date: post.date,
                    category: category.title,
                    technique: post.technique,
                    genre: post.genre,
                    style: post.style,
                    likes: post.likes.length,
                    comments: comments
                });
                categoryOptions.add(category.title);
                genreOptions.add(post.genre);
                styleOptions.add(post.style);
                techniqueOptions.add(post.technique);
            }
            categoryOptions.forEach(option => {
                document.categoryOptions.push(option);
            });
            genreOptions.forEach(option => {
                document.genreOptions.push(option);
            });
            styleOptions.forEach(option => {
                document.styleOptions.push(option)
            });
            techniqueOptions.forEach(option => {
                document.techniqueOptions.push(option);
            });
            res.status(200).json(document);
        } else {
            res.sendStatus(500);
        }
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
}

module.exports.statistics = async function(req, res) {
    try {
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
        const user = await userModel.findById(req.userId);
        let document = {
            posts: []
        }
        if(user) {
            const userPosts = await postModel.find({owner: user._id})
            for (let i = 0; i < userPosts.length; i++) {
                const post = userPosts[i];
                const category = await categoryModel.findById(post.category);
                const topIndex = top.findIndex(element => {
                    return element._id.toString() === post._id.toString()
                });
                document.posts.push({
                    _id: post._id,
                    title: post.title,
                    author: user.username,
                    authorId: user._id,
                    authorUrl: `http://${keys.host}:${keys.port}/api/authors/${user._id}`,
                    authorImageUrl: `http://${keys.host}:${keys.port}/api/images/${user.imageUrl.replace('/uploads/', '')}`,
                    imageUrl: `http://${keys.host}:${keys.port}/api/images/${post.artworkUrl.replace('/uploads/', '')}`,
                    date: post.date,
                    category: category.title,
                    technique: post.technique,
                    genre: post.genre,
                    style: post.style,
                    likes: post.likes.length,
                    comments: post.comments.length,
                    topIndex: topIndex + 1
                });
            }
            res.status(200).json(document);
        } else {
            res.sendStatus(500);
        }
    } catch {
        console.log(error);
        res.sendStatus(500);
    }
}

module.exports.deletePost = async function(req, res) {
    try {
        const post = await postModel.findById(req.params.id);
        if(post.imageUrl) {
            const url = path.resolve(`src/uploads/${post.imageUrl}`);
            fs.unlink(url, (err) => {
                console.log(err);
            });
        }
        await postModel.deleteOne({_id: post._id});
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
        const user = await userModel.findById(req.userId);
        let document = {
            posts: []
        }
        if(user) {
            const userPosts = await postModel.find({owner: user._id})
            for (let i = 0; i < userPosts.length; i++) {
                const post = userPosts[i];
                const category = await categoryModel.findById(post.category);
                const topIndex = top.findIndex(element => {
                    return element._id.toString() === post._id.toString()
                });
                document.posts.push({
                    _id: post._id,
                    title: post.title,
                    author: user.username,
                    authorId: user._id,
                    authorUrl: `http://${keys.host}:${keys.port}/api/authors/${user._id}`,
                    authorImageUrl: `http://${keys.host}:${keys.port}/api/images/${user.imageUrl.replace('/uploads/', '')}`,
                    imageUrl: `http://${keys.host}:${keys.port}/api/images/${post.artworkUrl.replace('/uploads/', '')}`,
                    date: post.date,
                    category: category.title,
                    technique: post.technique,
                    genre: post.genre,
                    style: post.style,
                    likes: post.likes.length,
                    comments: post.comments.length,
                    topIndex: topIndex + 1
                });
            }
            res.status(200).json(document);
        } else {
            res.sendStatus(500);
        }
    } catch {
        console.log(error);
    }
}

module.exports.search = async function(req, res) {
    try {
        const query = req.body.query;
        const raw = await postModel.find({});
        const posts = raw.filter(post => {
            return (post.title.toLowerCase().includes(query.toLowerCase()) || post.style.toLowerCase().includes(query.toLowerCase()) || post.genre.toLowerCase().includes(query.toLowerCase()) || post.technique.toLowerCase().includes(query.toLowerCase()));
        });
        let categoryOptions = new Set();
        let techniqueOptions = new Set();
        let styleOptions = new Set();
        let genreOptions = new Set();
        let document = {
            posts: [],
            categoryOptions: [],
            styleOptions: [],
            genreOptions: [],
            techniqueOptions: []
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
                authorId: user._id,
                authorUrl: `http://${keys.host}:${keys.port}/api/authors/${user._id}`,
                authorImageUrl: `http://${keys.host}:${keys.port}/api/images/${user.imageUrl.replace('/uploads/', '')}`,
                imageUrl: `http://${keys.host}:${keys.port}/api/images/${post.artworkUrl.replace('/uploads/', '')}`,
                date: post.date,
                category: category.title,
                technique: post.technique,
                genre: post.genre,
                style: post.style,
                likes: post.likes.length,
                comments: comments
            });
            categoryOptions.add(category.title);
            genreOptions.add(post.genre);
            styleOptions.add(post.style);
            techniqueOptions.add(post.technique);
        }
        categoryOptions.forEach(option => {
            document.categoryOptions.push(option);
        });
        genreOptions.forEach(option => {
            document.genreOptions.push(option);
        });
        styleOptions.forEach(option => {
            document.styleOptions.push(option)
        });
        techniqueOptions.forEach(option => {
            document.techniqueOptions.push(option);
        });
        res.status(200).json(document);
    } catch {
        console.log(error);
    }
}