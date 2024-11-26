// auth.middleware.js

const jwt = require("jsonwebtoken");

require('dotenv').config();

// Middleware for authentication using JWT
const auth = (req, res, next) => {
    // Extracting the token from the request headers
    const token = req.headers.authorization;

    if (token) {
        try {
            // Verifying the token using the secret key 'name'
            const decoded = jwt.verify(token, process.env.secretKey);

            // Adding the decoded user ID to the request body
            req.body.userId = decoded.userId;
            req.body.role = decoded.userRole
            
            // Move to the next middleware or route handler
            next();
        } catch (error) {
            // Token verification failed
            res.status(400).send({ "message": "Please Login To access" });
        }
    } else {
        // Token not provided
        res.status(400).send({ "message": "Please provid the token" });
    }
};

module.exports = { auth };