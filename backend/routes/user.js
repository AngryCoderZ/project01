const express = require('express')
const router = express.Router()
const { requireSignin,authMiddleware,adminMiddleware,masterMiddleware } = require('../controllers/auth')

const { update,remove } = require('../controllers/user')

router.put('/user',requireSignin,authMiddleware, update)
router.delete('/user',requireSignin,authMiddleware, remove)

module.exports = router