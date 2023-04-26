const jwt = require('jsonwebtoken');
const keys = require('./../config/keys');

module.exports = function(req, res, next) {
    if(req.method === 'OPTIONS') {
        next();
    }
    try {
        const token = req.headers.authorization.split(' ')[1]
        if(!token) {
            return res.sendStatus(403);
        }
        const { id } = jwt.verify(token, keys.jwt);
        req.userId = id
        next();
    } catch(error) {
        console.log(error);
    }
};