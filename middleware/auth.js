const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
    // Get Token From Header
    const token = req.header('x-auth-token');
    
    //check if token is present or not 
    if(!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' })
    }

    //Verify the token
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));

        req.user = decoded.user;
        next();
        
    } catch (error) {
        res.status(401).json({msg: 'Token is not valid'}); 
    }
}

