const User = require('../models/user')
const { errorCode } = require('../helpers/errorHandler')
const jwt = require('jsonwebtoken')
const { expressjwt: expressJwt } = require('express-jwt');

exports.signup = async (req, res) => {
    let { username, email, password, repassword } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({
            error: "all fields required"
        })
    }

    if (password !== repassword) {
        return res.status(400).json({
            error: "password don't match"
        })
    }

    const existUser = await User.findOne(
        {
            $or: [
                { username },
                { email: email }
            ]
        }
    );
    if (existUser) {
        return errorCode(res, 400, "user already exist")
    }
    else {
        const newUser = new User({ username, email, password })
        try {
            const user = await newUser.save();
            res.json({ message: "Signup successfull! Please Signin" })
        }
        catch (err) {
            return res.status(400).json({
                error: err
            })
        }
    }

}

exports.signin = async (req, res) => {
    let { username, email, password } = req.body;
    if (!password) {
        return errorCode(res, 400, "all field required")
    }

    if (username || email) {
        User.findOne({
            $and: [
                {
                    $or: [
                        { username },
                        { email }
                    ]
                },
                { password }
            ]
        }).then((user) => {
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '9d' });
            const { _id, username, email, role } = user
            return res.json({
                token,
                user: { _id, username, email, role }
            })
        })
            .catch(err => {
                return errorCode(res, 400, "Email and passord don't match")
            })
    } else {
        return errorCode(res, 400, "all field required")
    }

}

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'auth',
    algorithms: ["HS256"]
})

exports.authMiddleware = async (req, res, next) => {
    try {
        const userId = req.auth._id;
        const user = await User.findById({ _id: userId })
        req.profile = user;
        next();
    }
    catch (err) {
        errorCode(res, 400, "user not found")
    }
}

exports.adminMiddleware = async (req, res, next) => {
    try {
        const userId = req.auth._id;
        const user = await User.findById({ _id: userId })
        if (user.role < 1 || user.role > 2) {
            return errorCode(res, 400, "Admin resource, Access denied")
        }
        req.profile = user;
        next();
    }
    catch (err) {
        errorCode(res, 400, "user not found")
    }
}

exports.masterMiddleware = async (req, res, next) => {
    try {
        const userId = req.auth._id;
        const user = await User.findById({ _id: userId })
        if (user.role !==1) {
            return errorCode(res, 400, "Admin resource, Access denied")
        }
        req.profile = user;
        next();
    }
    catch (err) {
        errorCode(res, 400, "user not found")
    }
}