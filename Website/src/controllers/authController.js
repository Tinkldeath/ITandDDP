const path = require('path');
const userModel = require('./../data/models/userModel');
const bcrypt = require('bcryptjs');
const keys = require('./../config/keys');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const generateAcessToken = (id) => {
    const payload = { id }
    return jwt.sign(payload, keys.jwt, {expiresIn: "24h"});
}

module.exports.getRegister = async function (req, res) {
    res.sendFile(path.resolve('src/frontend/pages/register.html'));
}

module.exports.getLogin = async function (req,res) {
    res.sendFile(path.resolve('src/frontend/pages/login.html'));
}

module.exports.login = async function (req,res) {
    try {
        console.log(req.body);
        const { login, password } = req.body
        const user = await userModel.findOne({login: login})
        if(!user) {
            return res.status(401).json({message: `User with login ${login} does not exist`});
        } else {
            const validPassword = bcrypt.compareSync(password, user.password);
            if(!validPassword) {
                return res.status(401).json({message: `Incorrect password`});
            } else {
                const token = generateAcessToken(user._id);
                return res.status(200).json({jwt: token});
            }
        }
    } catch(error) {
        console.log(error);
        res.sendStatus(400);
    }
};

module.exports.register = async function (req,res) {
    try {
        const { login, password, username, imageUrl } = req.body
        const candidate = await userModel.findOne( {login: login} )
        if (candidate) {
            fs.unlink(path.resolve('src' + imageUrl), (error) => {
                if(error) {
                    console.log(error);
                }
            });
            return res.status(400).json({message: `Login ${login} already exists. Please, try another`})
        } else {
            const encryptedPassword = bcrypt.hashSync(password, keys.salt);
            const user = new userModel({
                login: login,
                password: encryptedPassword,
                username: username,
                imageUrl: imageUrl,
                topRated: false,
                friends: [],
                posts: [],
                chats: [],
                friend_requests: []
            });
            await user.save();
            return res.status(201).json({message: `User ${login} registered successfully`});
        }
    } catch(error) {
        console.log(error);
        res.sendStatus(400);
    }
};