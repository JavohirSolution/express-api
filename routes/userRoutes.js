const router = require('express').Router();
const User = require("../models/users")
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const authMiddleware = require("../middleware/authMiddleware.js")

// user register
router.post("/register", async (req, res) => {
    try {
        //check if the user already exists
        const userExists = await User.findOne({ email: req.body.email })
        if (userExists) {
            return res
                .status(200)
                .send({
                    message: "User already exists",
                    success: false
                })
        }
        const newUser = await new User({
            name: req.body.name,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, 10),
            isAdmin: req.body.isAdmin,
        }).save()

        res.send({
            message: "User created successfully",
            success: true
        })

    } catch (error) {
        res.status(500).send({
            message: error.message,
            data: error,
            success: false,
        })
    }
});

//user login
router.post('/login', async (req, res) => {

    try {
        //check if user already exists
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res
                .status(200)
                .send({
                    message: "User does not exist",
                    success: false
                });
        }
        //check password
        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if (!validPassword) {
            return res
                .status(200)
                .send({
                    message: "Invalid Password",
                    success: false
                })
        }
        const token = jwt.sign(
            { userId: user._id, },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.send({
            message: "User logged in successfully",
            success: true,
            data: token
        })
    } catch (error) {
        res
            .status(500)
            .send({
                message: error.message,
                success: false,
                data: error,
            })
    }

})

router.get('/get-user-info', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.body.userId);
        res.status(200).send({
            message: "User info fetched successfully",
            data: user,
            success: true,
        })
    } catch (error) {
        res.status(500).send({
            message: error.message,
            data: error,
            success: false,
        })
    }
})

router.get("/get-all-users", async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).send({
            message: "Userlar muvaffaqiyatli olindi",
            data: users,
            success: true,
        })
    } catch (error) {
        res.status(500).send({
            message: error.message,
            data: error,
            success: false,
        });
    }
})

router.delete("/delete-by-id", authMiddleware, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.body.userId);
        res.send({
            message: 'User muvaffaqiyatli oʻchirildi',
            success: true,
        });
    } catch (error) {
        res.status(500).send({
            message: error.message,
            data: error,
            success: false,
        });
    }


});

module.exports = router;