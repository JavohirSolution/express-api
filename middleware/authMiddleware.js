const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.body.userId = { userId: decodedToken.userId };
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "You are not authenticated",
            error: error.message
        });
    }
};