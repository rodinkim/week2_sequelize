const jwt = require("jsonwebtoken");
const { Users } = require("../models");

module.exports = async (req, res, next) => {
  try {
    const { authorization } = req.cookies;
    const [tokenType, token] = authorization.split(" ");
    if (tokenType !== "Bearer") {
      return res.status(403).json({ message: "전달된 쿠키에서 오류가 발생했습니다." });
    }

    const decodedToken = jwt.verify(token, "customized_secret_key");
    const userId = decodedToken.userId;

    const user = await Users.findOne({ where: { userId } });
    if (!user) {
      res.clearCookie("authorization");
      return res.status(403).json({ message: "로그인이 필요한 기능입니다." });
    }
    res.locals.user = user;

    next();
  } catch (error) {
    res.clearCookie("authorization");
    return res.status(401).json({
      message: "비정상적인 요청입니다."
    });
  }
}