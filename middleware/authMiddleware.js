const jwt = require('jsonwebtoken');
const User = require('../models/users');

module.exports = async (req, res, next) => {
    try {
        // Check if Authorization header is present
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            throw new Error('Authorization header is missing');
        }

        // Extract token from Authorization header
        const token = authHeader.split(' ')[1];
        if (!token) {
            throw new Error('Token is missing');
        }

        // Verify token validity
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        // Retrieve user from database based on decoded token's userId
        const user = await User.findById(decodedToken.userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Attach user to request object
        req.user = user;

        // Call next middleware
        next();
    } catch (error) {
        // Handle token verification errors
        let errorMessage = 'Invalid token';
        if (error instanceof jwt.TokenExpiredError) {
            errorMessage = 'Token expired';
        } else if (error instanceof jwt.JsonWebTokenError) {
            errorMessage = 'Invalid token';
        } else if (error.message === 'User not found') {
            errorMessage = 'User associated with token not found';
        }

        // Send error response
        return res.status(401).json({
            success: false,
            message: 'Authentication failed',
            error: errorMessage
        });
    }
};