const userModel = require("../models/user");
const jwt = require("jsonwebtoken");

module.exports = async (req, res) => {
  try {
    await userModel.find(async () => {
      const token = req.headers.authorization;

      console.log(token, "tokrn");
      if (!token) {
        res.send("you dont have permission");
        return;
      }

      const decodedToken = jwt.decode(token);
      if (decodedToken.sub) {
        console.log(decodedToken);
        const user = await userModel.findById(decodedToken.sub);
        if (!user) {
          console.log("you dont have permisson");
        }

        res.send(user);
      }
    });
  } catch (error) {
    console.log(error, "error");
    res.status(401).send({ error: error });
  }
};
