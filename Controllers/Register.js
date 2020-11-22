const userModel = require("../models/user");
const Joi = require("@hapi/joi");

module.exports = async (req, res) => {
  const { username, email, password, city, number } = req.body;
  const bodySchema = Joi.object({
    email: Joi.string().email().required(),
    username: Joi.string().required(),
    number: Joi.number(),
    city: Joi.string(),
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
  } catch (error) {
    res.statusCode = 400;
    res.send(error.message);
  }
};