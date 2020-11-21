const userModel = require("../models/user");
const bodyParser = require("body-parser");
const hashPassword = require("../helper");
const jwt = require("jsonwebtoken");

var urlencodedParser = bodyParser.urlencoded({ extended: false });

module.exports =
  (urlencodedParser,
  async (req, res) => {
    try {
      const { email, password } = req.body;

      console.log(req.body, "req.body");
      const userAcc = await userModel.findOne({ email });

      if (!userAcc) {
        res.send("user not found");
      } else {
        if (userAcc.password === hashPassword(password, userAcc.salt)) {
          const token = jwt.sign({ sub: userAcc._id }, "" + userAcc.salt, {
            expiresIn: 30000000000000000000000,
          });

          res.send(token);
          console.log("successfully logged in ");
        } else {
          res.statusCode = 403;
          console.log("password is wrong ");
          res.send("password is wrong");
        }
      }
    } catch (error) {
      console.log(error);
    }
  });
