const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            trim: true,
            required: [true, "username is required"],
            index: true,
            unique: true,
            lowercase: true,
        },
        email: {
            type: String,
            trim: true,
            required: [true, "email is required"],
            index: true,
            unique: true,
            lowercase: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error('email is invalid')
                }
            }
        },
        password: {
            type: String,
            required: [true, "password is required"],
        },
        role: {
            type: Number,
            default: 0 //1 for master , 2 for admin, 0 for user
        }

    },
    { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);