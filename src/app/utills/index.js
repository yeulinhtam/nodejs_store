const jwt = require('jsonwebtoken');



module.exports.isAuth = (req, res, next) => {
    const authorization = req.headers.authorization;
    if (authorization) {
        const token = authorization.slice(7, authorization.length);
        jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
            if (err) {
                res.status(401).send({ message: 'Invalid Token' });
            } else {
                req.user = decode;
                next();
            }
        });
    } else {
        return res.status(401).send({ messages: 'No token' });
    }
}

module.exports.generateToken = (user) => {
    return jwt.sign({
        _id: user._id,
        email: user.email
    }, process.env.JWT_SECRET,
        {
            expiresIn: '1d'
        }
    )
};
