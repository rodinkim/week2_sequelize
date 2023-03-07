const express = require("express");
const { Users } = require("../models");
const jwt = require("jsonwebtoken");
const router = express.Router();

// 회원가입
router.post("/signup", async (req, res) => {
    try{
    const { nickname, password, confirm} = req.body;
    const regexNumorAlpha = /^[a-zA-Z0-9]*$/;
    const regexNickInPass = new RegExp(nickname);
    const isExistUser = await Users.findOne({ where: { nickname } });
    
    if (!regexNumorAlpha.test(nickname) || nickname.length <= 2){
        return res.status(412).json({ errorMessage: "닉네임의 형식이 일치하지 않습니다." });
    }
    if (password !== confirm) {
        return res.status(412).json({ errorMessage: "패스워드가 일치하지 않습니다." });
    }
    if (password.length <= 3) {
        return res.status(412).json({ errorMessage: "패스워드 형식이 일치하지 않습니다." });
    }
    if(regexNickInPass.test(password)){
        return res.status(412).json({ errorMessage: "패스워드에 닉네임이 포함되어 있습니다." });
    }
    if (isExistUser) {
        return res.status(412).json({ errorMessage: "중복된 닉네임입니다." });
    }

    // Users 테이블에 사용자를 추가합니다.
    const user = await Users.create({ nickname, password });
    return res.status(201).json({ message: "회원 가입에 성공하였습니다." });
    
    } catch (err) {
        console.log(err);
        res.status(400).send({ errorMessage: "요청한 데이터 형식이 올바르지 않습니다." });
    }
});

// 로그인
router.post("/login", async (req, res) => {
    try {
    const { nickname, password } = req.body;
    const user = await Users.findOne({ where: { nickname } });
    
    if (!user || user.password !== password) {
        return res.status(412).json({ message: "닉네임 또는 패스워드를 확인하세요." });
    } 

    // jwt 생성
    const token = jwt.sign({ userId: user.userId }, "customized_secret_key");
    res.cookie("authorization", `Bearer ${token}`);
    // return res.status(200).json({ message: "로그인 성공" });
    res.status(200).json({ token }); // JWT를 Body로 할당합니다!

    } catch (err) {
        console.log(err);
        res.status(400).send({ errorMessage: "로그인에 실패했습니다." });
    }
});


module.exports = router;