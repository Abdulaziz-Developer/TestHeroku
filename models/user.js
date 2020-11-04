const { Schema, model } = require("mongoose");
const shortId = require("shortid");
const hashPassword = require("../helper");
const userSchema = new Schema({
  username: String,
  email: { type: String, unique: true },
  password: String,
  number: String,
  city: String,
  salt: String,
  Courses: [
    { title: String, completed: Boolean },
    { title: String, completed: Boolean },
    { title: String, completed: Boolean },
    { title: String, completed: Boolean },
    { title: String, completed: Boolean },
    { title: String, completed: Boolean },
    { title: String, completed: Boolean },
    { title: String, completed: Boolean },
    { title: String, completed: Boolean },
  ],
});
userSchema.pre("save", async function (next) {
  this.Courses = [
    { "title": "lesson1-1", "completed": false },
    { "title": "lesson1-2", "completed": false },
    { "title": "lesson1-3", "completed": false },
    { "title": "lesson2-1", "completed": false },
    { "title": "lesson2-2", "completed": false },
    { "title": "lesson2-3", "completed": false },
    { "title": "lesson3-1", "completed": false },
    { "title": "lesson3-2", "completed": false },
    { "title": "lesson3-3", "completed": false }
  ];
  const salt = "secret";
  this.salt = shortId.generate();
  this.password = await hashPassword(this.password, this.salt);
  console.log(this.password);
  next();
});

const userModel = new model("users", userSchema);
module.exports = userModel;
