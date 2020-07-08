const config = require('../config');
const jwt = require('jsonwebtoken');

const isAuth = (req, res, next) => {
    if(req.path === '/login') {
        next();
    } else {
        const tokenArray = req.headers.authorization.split(" ");
        try {
            jwt.verify(tokenArray[1], config.secretKey);
            next();
        } catch (error) {
            res.status(401).json(error);
        }
    }   
}

module.exports = isAuth;