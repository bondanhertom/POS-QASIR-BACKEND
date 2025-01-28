const { User } = require("../models");
const { comparePassword } = require("../helpers/bcrypt");
const { createToken } = require("../helpers/jwt");

class ControllerUser {
  static async register(req, res) {
    try {
      const { name, email, password } = req.body;
      if (!email) throw { name: "email_required" };
      if (!password) throw { name: "password_required" };
      const newUser = await User.create({
        name,
        email,
        password,
      });
      res.status(201).json({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  }

  static async login(req, res) {
    try {
        let { email, password } = req.body
        if (!email) throw { name: "email_required" }
        if (!password) throw { name: "password_required" }

        const findUser = await User.findOne({
            where: {
                email,
            }
        })
        if (!findUser) throw { name: "invalid_email/password" }
        const passwordValidated = comparePassword(password, findUser.password)

        if (!passwordValidated) throw { name: "invalid_email/password" }
        const payload = {
            id: findUser.id,
        }

        const access_token = createToken(payload)
        console.log(access_token,"<<<< token");

        const response = {
            access_token,
            email: findUser.email
        }

        res.status(200).json(response)
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
}

}

module.exports = ControllerUser;
