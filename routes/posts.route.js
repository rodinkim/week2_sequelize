const express = require("express");
const { Posts } = require("../models");
const authMiddleware = require("../middlewares/auth-middleware");
const router = express.Router();

// 게시글 생성
router.post("/", authMiddleware, async (req, res) => {
    try {
    const { userId } = res.locals.user;
    const { title, content } = req.body;

    const post = await Posts.create({
        UserId: userId,
        title,
        content,
    });

    return res.status(201).json({ message: "게시글 작성에 성공하였습니다." });

    }catch (err) {
        console.log(err);
        res.status(400).send({ errorMessage: "게시글 작성에 실패하였습니다." });
    }
});


// 게시글 목록 조회
router.get("/", authMiddleware, async (req, res) => {
    try {
    const posts = await Posts.findAll({
      attributes: ["postId", "UserId", "title", "createdAt", "updatedAt"],
      order: [['createdAt', 'DESC']],
    });
  
    return res.status(200).json({ posts: posts });
    }catch (err) {
        console.log(err);
        res.status(400).send({ errorMessage: "게시글 조회에 실패하였습니다." });
    }
});


// 게시글 상세 조회
router.get("/:postId", authMiddleware, async (req, res) => {
    try {
    const { postId } = req.params;
    const post = await Posts.findOne({
      attributes: ["postId", "UserId", "title", "content", "createdAt", "updatedAt"],
      where: { postId }
    });
  
    return res.status(200).json({ data: post });
    }catch (err) {
        console.log(err);
        res.status(400).send({ errorMessage: "게시글 조회에 실패하였습니다." });
    }
});

// 게시글 수정
router.put('/:postId', authMiddleware, async (req, res) => {
    try {
    const { postId } = req.params;
    const { title, content} = req.body;
    

    const post = await Posts.findOne({ where: { postId } });
    if (!post) {
        return res.status(401).json({ message: '게시글이 존재하지 않습니다.' });
    } 

    await Posts.update(
        { title , content}, { where: { postId }}
    );

    res.status(200).json({ message: "게시글이 수정되었습니다." });
    }catch (err) {
    console.log(err);
    res.status(400).send({ errorMessage: "게시글 수정에 실패하였습니다." });
    }
});
  
  // 게시글 삭제
  router.delete('/:postId', authMiddleware, async (req, res) => {
    try {
    const { postId } = req.params;

    const post = await Posts.findOne({ where: { postId } });
    if (!post) {
        return res.status(404).json({ message: '게시글이 존재하지 않습니다.' });
    } 

    await Posts.destroy({ where: { postId } });

    res.status(200).json({ message: "게시글이 삭제되었습니다." });
    }catch (err) {
    console.log(err);
    res.status(400).send({ errorMessage: "게시글 수정에 실패하였습니다." });
    }
});

module.exports = router;