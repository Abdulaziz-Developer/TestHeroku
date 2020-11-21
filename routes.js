const express = require("express");
const router = express.Router();
const Home = require("./Controllers/Home");
const Register = require("./Controllers/Register");
const Login = require("./Controllers/Login");

router.get("/", Home);
router.post("/register", Register);
router.post("/login", Login);

module.exports = router;
