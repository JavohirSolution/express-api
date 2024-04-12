const router = require('express').Router();
const User = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const authMiddleware = require("../middleware/authMiddleware.js");

// User register
router.post("/register", async (req, res) => {
    try {
        const userExists = await User.findOne({ email: req.body.email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }
        const newUser = await new User({
            name: req.body.name,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, 10),
            isAdmin: req.body.isAdmin,
        }).save();

        res.status(201).json({
            success: true,
            message: "User created successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to register user",
            error: error.message
        });
    }
});

// User login
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(401).json({
                success: false,
                message: "Invalid password"
            });
        }
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            data: token
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to log in",
            error: error.message
        });
    }
});

// Get user info
router.get('/get-user-info', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        res.status(200).json({
            success: true,
            message: "User info fetched successfully",
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch user info",
            error: error.message
        });
    }
});

// Get all users
router.get("/get-all-users", async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve users",
            error: error.message
        });
    }
});

// Delete user by ID
router.delete("/delete-by-id", authMiddleware, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user.userId);
        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete user",
            error: error.message
        });
    }
});

module.exports = router;