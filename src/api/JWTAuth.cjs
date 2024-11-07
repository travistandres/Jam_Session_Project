// middleware/auth.js
const jwt = require('jsonwebtoken');

//Defining Secret Key for signing purposes
const SECRET_KEY = process.env.JWT_SECRET || "3n@4#zC^d8F!q9J4^w@U9tP*lZ$eT0z";

const authenticateJWT = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Bearer <token>

    if (!token) {
        return res.sendStatus(403); // Forbidden if no token
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.sendStatus(403); // Forbidden if token is invalid
        }
       // req.user = user; // Save user info for use in other routes

        //Maybe this would make it easier to pass specific info where needed? Also security?
        req.user = {
            id: user.id,
            name: user.username,
        };
        next();
    });
};

module.exports = authenticateJWT;
