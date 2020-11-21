const userModel = require("../models/user");
const bodyParser = require("body-parser");
const Joi = require("@hapi/joi");
var urlencodedParser = bodyParser.urlencoded({ extended: false });

module.exports =
  (urlencodedParser,
  async (req, res) => {
    const { username, email, password, city, number } = req.body;
    const bodySchema = Joi.object({
      email: Joi.string().email().required(),
      username: Joi.string().required(),
      number: Joi.number().required(),
      city: Joi.string().required(),
      password: Joi.string().min(6).required(),
    });
    const validationResult = bodySchema.validate(req.body);

    if (validationResult.error) {
      res.statusCode = 400;
      res.send(validationResult.error.details[0].message);
      return;
    }
    try {
      const newUser = new userModel({
        username,
        email,
        number,
        city,
        password,
      });

      await newUser.save();

      res.send(newUser);
      res.send("registration successfull ! ");
    } catch (error) {
      res.statusCode = 400;
      res.send(error.message);
    }
  });
