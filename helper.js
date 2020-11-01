const crypto = require("crypto");

const hashPassword = (password, salt = "secret") => {
  console.log(password, "password")
  return crypto.createHmac("sha256", salt).update(password).digest("hex");
  
};

module.exports = hashPassword;
