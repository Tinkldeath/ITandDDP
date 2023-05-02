const userModel = require('./../data/models/userModel');
const postModel = require('./../data/models/postModel');
const categoryModel = require('./../data/models/categoryModel');
const friendRequestModel = require('./../data/models/friendRequestModel');
const chatModel = require('./../data/models/chatModel');
const events = require('events');
const keys = require('./../config/keys');
const messageModel = require('./../data/models/messageModel');

const emitter = new events.EventEmitter();

function authorsSort(author1, author2) {
    if (author1.topRated === true && author2.topRated === false) {
        return -1;
    }
    if (author1.topRated === false && author2.topRated === true) {
        return 1;
    }
    return 0;
}

module.exports.authors = async function(req, res) {
    try {
        const users = (await userModel.find({})).sort(authorsSort);
        document = {
            authors: []
        }
        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            let imageUrl = '';
            if(user.imageUrl) {
                imageUrl = `http://${keys.host}:${keys.port}/api/images/` + (user.imageUrl.replace('/uploads/', ''))
            } else {
                imageUrl = `http://${keys.host}:${keys.port}/api/images/duck.png`
            }
            document.authors.push({
                _id: user._id,
                name: user.username,
                imageUrl: imageUrl,
                topRated: user.topRated,
                posts: user.posts.length,
                friends: user.friends.length
            });
        }
        res.status(200).json(document);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
};

module.exports.user = async function(req, res) {
    try {
        const id = req.userId;
        if(!id) {
            return res.status(200).json({id: 'Unauthorized'});
        } else {
            const user = await userModel.findOne({_id: id});
            let imageLink;
            if(user.imageUrl){
                imageLink = `http://${keys.host}:${keys.port}/api/images/` + user.imageUrl.replace('/uploads/', '');
                return res.status(200).json({ id: user._id, name: user.username, imageLink: imageLink });
            }
            return res.status(200).json({ id: user._id, name: user.username });
        }
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
}

module.exports.profile = async function(req, res) {
    try {
        let document = {
            user: {},
            posts: [],
            categoryOptions: [],
            styleOptions: [],
            genreOptions: [],
            techniqueOptions: []
        };
        let categoryOptions = new Set();
        let techniqueOptions = new Set();
        let styleOptions = new Set();
        let genreOptions = new Set();
        const id = req.params.id;
        const user = await userModel.findById(id);
        const posts = await postModel.find({});
        const userPosts = posts.filter(post => {
            return post.owner.toString() === id
        });
        let imageUrl = '';
        if(user.imageUrl) {
            imageUrl = `http://${keys.host}:${keys.port}/api/images/` + (user.imageUrl.replace('/uploads/', ''))
        } else {
            imageUrl = `http://${keys.host}:${keys.port}/api/images/duck.png`
        }
        let friendButton = ''
        const friend = user.friends.filter(frined => {
            return frined._id.toString() === req.userId.toString()
        })
        if(user._id.toString() === req.userId.toString()) {
            friendButton = 'You'
        }
        else if(friend.length > 0) {
            friendButton = 'Unfriend'
        } else {
            friendButton = 'Friend'
        }
        const sender = await userModel.findById(req.userId);
        const requests = await friendRequestModel.find({sender: sender._id, reciever: user._id});
        if(requests.length > 0) {
            friendButton = 'Requested'
        }
        document.user = {
            _id: user._id,
            name: user.username,
            imageUrl: imageUrl,
            topRated: user.topRated,
            friendButton: friendButton,
            posts: user.posts.length,
            friends: user.friends.length
        };
        for (let i = 0; i < userPosts.length; i++) {
            const post = userPosts[i];
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
        if(req.userId === id) {
            document.user.currentUser = true
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
}

module.exports.friends = async function(req, res) {
    try {
        const requester = await userModel.findById(req.userId);
        const freindRequests = await friendRequestModel.find({reciever: requester._id});
        if(requester) {
            let document = {
                requests: [],
                authors: []
            }
            for (let i = 0; i < requester.friends.length; i++) {
                const user = await userModel.findById(requester.friends[i]);
                let imageUrl = '';
                if(user.imageUrl) {
                    imageUrl = `http://${keys.host}:${keys.port}/api/images/` + (user.imageUrl.replace('/uploads/', ''))
                } else {
                    imageUrl = `http://${keys.host}:${keys.port}/api/images/duck.png`
                }
                document.authors.push({
                    _id: user._id,
                    name: user.username,
                    imageUrl: imageUrl,
                    topRated: user.topRated,
                    posts: user.posts.length,
                    friends: user.friends.length
                });
            }
            for (let i = 0; i < freindRequests.length; i++) {
                const request = freindRequests[i];
                const sender = await userModel.findById(request.sender._id);
                let imageUrl = '';
                if(sender.imageUrl) {
                    imageUrl = `http://${keys.host}:${keys.port}/api/images/` + (sender.imageUrl.replace('/uploads/', ''))
                } else {
                    imageUrl = `http://${keys.host}:${keys.port}/api/images/duck.png`
                }
                document.requests.push({
                    _id: request._id,
                    senderId: sender._id,
                    sender: sender.username,
                    senderImageUrl: imageUrl
                });
            }
            res.status(200).json(document);
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

module.exports.friend = async function(req, res) {
    try {
        const sender = await userModel.findById(req.userId);
        const reciever = await userModel.findById(req.params.id);
        if(sender._id.toString() !== reciever._id.toString()) {
            const exists = await friendRequestModel.find({sender: sender._id, reciever: reciever._id});
            const mirror = await friendRequestModel.find({reciever: sender._id, sender: reciever._id});
            if(exists.length > 0) {
                res.status(200).json({message: 'Freind request sent'});
                return
            } else if (mirror.length > 0){
                res.status(200).json({message: `${reciever.username} has already sent friend request to you`});
                return
            }
            const request = new friendRequestModel({
                sender: sender._id,
                reciever: reciever._id
            });
            await request.save();
            res.status(200).json({message: 'Freind request sent'});
        }
        else {
            res.sendStatus(409);
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

module.exports.unfriend = async function(req, res) {
    try {
        const sender = await userModel.findById(req.userId);
        const reciever = await userModel.findById(req.params.id);
        const senderIndex = sender.friends.findIndex(friend => {
            return friend === reciever._id;
        });
        const recieverIndex = reciever.friends.findIndex(friend => {
            return friend === sender._id;
        });
        const chat1 = await chatModel.find({user1: sender._id, user2: reciever._id});
        const mirror = await chatModel.find({user1: reciever._id, user2: sender._id});
        let chat = null;
        if (chat1.length > 0) {
            chat = chat1[0]
        }else if(mirror.length > 0) {
            chat = mirror
        }
        sender.friends.splice(senderIndex, 1);
        reciever.friends.splice(recieverIndex, 1);
        if(chat !== null) {
            sender.chats.splice(sender.chats.indexOf(chat._id), 1);
            reciever.chats.splice(reciever.chats.indexOf(chat._id), 1);
            await chatModel.deleteOne({_id: chat._id});
        } 
        await sender.save();
        await reciever.save();
        res.status(200).json({message: 'Unfriended'});
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

module.exports.acceptFriendRequest = async function(req, res) {
    try {
        const friendRequest = await friendRequestModel.findById(req.params.id);
        if(friendRequest) {
            const sender = await userModel.findById(friendRequest.sender);
            const reciever = await userModel.findById(friendRequest.reciever);
            const chat = new chatModel({
                user1: sender._id,
                user2: reciever._id,
                messages: []
            });
            await chat.save();
            sender.friends.push(reciever._id);
            reciever.friends.push(sender._id);
            sender.chats.push(chat._id);
            reciever.chats.push(chat._id);
            await friendRequestModel.findByIdAndDelete(friendRequest._id);
            await sender.save();
            await reciever.save();
            res.status(200).json({message: 'Request accepted'});
            return
        } else {
            res.sendStatus(200).json({message: 'Request accepted'});
            return
        }
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
}

module.exports.denyFriendRequest = async function(req, res) {
    try {
        const friendRequest = await friendRequestModel.findById(req.params.id);
        if(friendRequest) {
            await friendRequestModel.findByIdAndDelete(friendRequest._id);
            res.status(200).json({message: 'Request deined'});
        } else {
            res.status(200).json({message: 'Request deined'});
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

module.exports.chats = async function(req, res) {
    try {
        let document = {
            chats: []
        }
        const user = await userModel.findById(req.userId);
        for (let i = 0; i < user.chats.length; i++) {
            const chatId = user.chats[i];
            const chat = await chatModel.findById(chatId);
            if(chat.user1.toString() === user._id.toString()){
                const companion = await userModel.findById(chat.user2);
                let imageUrl = '';
                if(companion.imageUrl) {
                    imageUrl = `http://${keys.host}:${keys.port}/api/images/` + (companion.imageUrl.replace('/uploads/', ''))
                } else {
                    imageUrl = `http://${keys.host}:${keys.port}/api/images/duck.png`
                }
                document.chats.push({
                    _id: chat._id,
                    companionId: companion._id,
                    companion: companion.username,
                    companionImageUrl: imageUrl
                });
            }else if(chat.user2.toString() === user._id.toString()){
                const companion = await userModel.findById(chat.user1);
                let imageUrl = '';
                if(companion.imageUrl) {
                    imageUrl = `http://${keys.host}:${keys.port}/api/images/` + (companion.imageUrl.replace('/uploads/', ''))
                } else {
                    imageUrl = `http://${keys.host}:${keys.port}/api/images/duck.png`
                }
                document.chats.push({
                    _id: chat._id,
                    companionId: companion._id,
                    companion: companion.username,
                    companionImageUrl: imageUrl
                });
            }
        }
        res.status(200).json(document);

    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
}

module.exports.addMessage = async function(req, res) {

}

module.exports.checkMessage = async function(req, res) {
    const id = req.params.id.toString();
    emitter.once(id, (document) => {
        res.status(200).json(document);
    });
}

module.exports.chat = async function(req, res) {
    try {
        const user = await userModel.findById(req.userId);
        const chat = await chatModel.findById(req.params.id);
        let document = {
            _id: chat._id,
            companion: {},
            user: {},
            messages: []
        }
        if(chat.user1.toString() === user._id.toString()) {
            const companion = await userModel.findById(chat.user2);
            let imageUrl = '';
            if(companion.imageUrl) {
                imageUrl = `http://${keys.host}:${keys.port}/api/images/` + (companion.imageUrl.replace('/uploads/', ''))
            } else {
                imageUrl = `http://${keys.host}:${keys.port}/api/images/duck.png`
            }
            let userImageUrl = ''
            if(user.imageUrl) {
                userImageUrl = `http://${keys.host}:${keys.port}/api/images/` + (user.imageUrl.replace('/uploads/', ''))
            } else {
                userImageUrl = `http://${keys.host}:${keys.port}/api/images/duck.png`
            }
            document.companion = {
                _id: companion._id,
                name: companion.username,
                imageUrl: imageUrl
            }
            document.user = {
                _id: user._id,
                name: user.username,
                imageUrl: userImageUrl
            }
            for (let i = 0; i < chat.messages.length; i++) {
                const messageId = chat.messages[i];
                const message = await messageModel.findById(messageId);
                document.messages.push({
                    _id: message._id,
                    sender: message.sender,
                    content: message.content
                });
            }
        }else if(chat.user2.toString() === user._id.toString()) {
            const companion = await userModel.findById(chat.user1);
            let imageUrl = '';
            if(companion.imageUrl) {
                imageUrl = `http://${keys.host}:${keys.port}/api/images/` + (companion.imageUrl.replace('/uploads/', ''))
            } else {
                imageUrl = `http://${keys.host}:${keys.port}/api/images/duck.png`
            }
            let userImageUrl = ''
            if(user.imageUrl) {
                userImageUrl = `http://${keys.host}:${keys.port}/api/images/` + (user.imageUrl.replace('/uploads/', ''))
            } else {
                userImageUrl = `http://${keys.host}:${keys.port}/api/images/duck.png`
            }
            document.companion = {
                _id: companion._id,
                name: companion.username,
                imageUrl: imageUrl
            }
            document.user = {
                _id: user._id,
                name: user.username,
                imageUrl: userImageUrl
            }
            for (let i = 0; i < chat.messages.length; i++) {
                const messageId = chat.messages[i];
                const message = await messageModel.findById(messageId);
                document.messages.push({
                    _id: message._id,
                    sender: message.sender,
                    content: message.content
                });
            }
        }
        res.status(200).json(document);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
}

module.exports.sendMessage = async function(req, res) {
    try {
        const chat = await chatModel.findById(req.params.id);
        const user = await userModel.findById(req.userId);
        const message = new messageModel({
            sender: user._id,
            content: req.body.message,
            date: Date.now(),
            edited: false,
            dateEdited: null
        });
        await message.save();
        chat.messages.push(message);
        await chat.save();
        let document = {
            _id: chat._id,
            companion: {},
            user: {},
            messages: []
        }
        if(chat.user1.toString() === user._id.toString()) {
            const companion = await userModel.findById(chat.user2);
            let imageUrl = '';
            if(companion.imageUrl) {
                imageUrl = `http://${keys.host}:${keys.port}/api/images/` + (companion.imageUrl.replace('/uploads/', ''))
            } else {
                imageUrl = `http://${keys.host}:${keys.port}/api/images/duck.png`
            }
            let userImageUrl = ''
            if(user.imageUrl) {
                userImageUrl = `http://${keys.host}:${keys.port}/api/images/` + (user.imageUrl.replace('/uploads/', ''))
            } else {
                userImageUrl = `http://${keys.host}:${keys.port}/api/images/duck.png`
            }
            document.companion = {
                _id: companion._id,
                name: companion.username,
                imageUrl: imageUrl
            }
            document.user = {
                _id: user._id,
                name: user.username,
                imageUrl: userImageUrl
            }
            for (let i = 0; i < chat.messages.length; i++) {
                const messageId = chat.messages[i];
                const message = await messageModel.findById(messageId);
                document.messages.push({
                    _id: message._id,
                    sender: message.sender,
                    content: message.content
                });
            }
        }else if(chat.user2.toString() === user._id.toString()) {
            const companion = await userModel.findById(chat.user1);
            let imageUrl = '';
            if(companion.imageUrl) {
                imageUrl = `http://${keys.host}:${keys.port}/api/images/` + (companion.imageUrl.replace('/uploads/', ''))
            } else {
                imageUrl = `http://${keys.host}:${keys.port}/api/images/duck.png`
            }
            let userImageUrl = ''
            if(user.imageUrl) {
                userImageUrl = `http://${keys.host}:${keys.port}/api/images/` + (user.imageUrl.replace('/uploads/', ''))
            } else {
                userImageUrl = `http://${keys.host}:${keys.port}/api/images/duck.png`
            }
            document.companion = {
                _id: companion._id,
                name: companion.username,
                imageUrl: imageUrl
            }
            document.user = {
                _id: user._id,
                name: user.username,
                imageUrl: userImageUrl
            }
            for (let i = 0; i < chat.messages.length; i++) {
                const messageId = chat.messages[i];
                const message = await messageModel.findById(messageId);
                document.messages.push({
                    _id: message._id,
                    sender: message.sender,
                    content: message.content
                });
            }
        }
        emitter.emit(chat._id.toString(), document);
        res.status(200).json({message: 'Message sent'});
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

module.exports.updateMessage = async function(req, res) {
    try {
        
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

module.exports.deleteMessage = async function(req, res) {
    try {
        
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}