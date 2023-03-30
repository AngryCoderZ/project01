const express = require('express')
const router = express.Router()

const { requireSignin,authMiddleware,adminMiddleware,masterMiddleware } = require('../controllers/auth')

router.get('/blog', requireSignin,adminMiddleware, (req, res) => {

    res.json({ test: "working",user:req.profile })
})

module.exports = router