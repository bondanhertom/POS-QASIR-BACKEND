const { verifyToken } = require("../helpers/jwt");
const { User } = require("../models");

async function authentication(req, res, next) {
  try {
    let access_token = req.headers.access_token;
    if (!access_token) throw { name: "InvalidToken" };

    let payload = verifyToken(access_token);
    let user = await User.findByPk(payload.id);
    if (!user) throw { name: "InvalidToken" };

    req.user = {
      id: user.id,
      email: user.email,
    };
    next();
  } catch (error) {
    console.log(error);
    
    res.status(400).json(error);
    // next(error);
  }
}

module.exports = { authentication }