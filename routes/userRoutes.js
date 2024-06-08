const { authUser, deleteUser, registerUser, loginUser, getAllUsers } = require('../controllers/userController.js');
const authMiddleware = require("../middleware/authMiddleware.js");

const router = require('express').Router();

// User register
router.post("/register", registerUser);

// User login
router.post('/login', loginUser);

// Get user info
router.get('/get-user-info', authMiddleware, authUser);

// Get all users
router.get("/get-all-users", getAllUsers);

// Delete user by ID
router.delete("/delete/:id", deleteUser);

module.exports = router;