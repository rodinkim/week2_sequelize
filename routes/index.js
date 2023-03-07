const express = require('express');
const postRouter = require ('./posts.route.js')
const userRouter = require ('./users.route.js')
//const authRouter = require ('./auths')

const router = express.Router()

router.use('/posts', postRouter)
router.use('/', userRouter)
//router.use('/',  authRouter)

module.exports = router;