const User = require('../models/user')
const { errorCode } = require('../helpers/errorHandler')

exports.update = async (req, res) => {
let userId = req.profile._id
    try {
        const user = await User.findByIdAndUpdate({ _id: userId },
            { $set: { ...req.body } },
            { new: true },
        )
        res.json(user)
    }
    catch (err) {
        errorCode(res, 400, "update user error")
    }
}

exports.remove = async (req, res) => {
let userId = req.profile._id
    try {
        const user = await User.findByIdAndDelete({ _id: userId })
        res.json({"mesage": `${user.username} deleted successfully`})
    }
    catch (err) {
        errorCode(res, 400, "delete user error")
    }
}