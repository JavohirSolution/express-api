const User = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { getAsync, setAsync, client } = require("../utils/redis.server");

async function getAllUsers(req, res) {
    try {
        const cacheKey = "all-user";
        const cacheData = await getAsync(cacheKey);

        if (cacheData) {
            res.status(200).json({
                success: true,
                message: "Users retrieved successfully (from cache)",
                data: JSON.parse(cacheData)
            });
        } else {
            const users = await User.find({});
            await setAsync(cacheKey, JSON.stringify(users), "EX", 10);

            res.status(200).json({
                success: true,
                message: "Users retrieved successfully (from database)",
                data: users
            });
        }
    } catch (error) {
        console.error("Error in retrieving users:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve users",
            error: "Internal server error"
        });
    }
}
//  fdfdfd


async function registerUser(req, res) {
    try {
        const { name, email, password, isAdmin } = req.body;

        // Validate request body
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email, and password are required fields"
            });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await new User({
            name,
            email,
            password: hashedPassword,
            isAdmin: isAdmin || false, // Set default value if not provided
        }).save();

        res.status(201).json({
            success: true,
            message: "User created successfully"
        });

    } catch (error) {
        console.error("Error in user registration:", error);
        res.status(500).json({
            success: false,
            message: "Failed to register user",
            error: "Internal server error"
        });
    }
}

async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        // Validate request body
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required fields"
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const validPassword = await bcrypt.compare(password, user.password);
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
            data: user,
            token
        });
    } catch (error) {
        console.error("Error in user login:", error);
        res.status(500).json({
            success: false,
            message: "Failed to log in",
            error: "Internal server error"
        });
    }
}

async function authUser(req, res) {
    try {
        // console.log(req.body.userId);
        const user = await User.findById(req.user);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "User info fetched successfully",
            data: user
        });
    } catch (error) {
        console.error("Error in fetching user info:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch user info",
            error: "Internal server error"
        });
    }
}


async function deleteUser(req, res) {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error("Error in deleting user:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete user",
            error: "Internal server error"
        });
    }
}

module.exports = { registerUser, loginUser, authUser, getAllUsers, deleteUser };