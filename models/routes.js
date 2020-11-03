const userModel = require("./user");
const bodyParser = require("body-parser");
const hashPassword = require("../helper.js");
const jwt = require("jsonwebtoken");
const Joi = require("@hapi/joi");
const { query } = require("express");

function setUpRoutes(app) {
  var urlencodedParser = bodyParser.urlencoded({ extended: false });
  const salt = "secret";

  app.get("/", async (req, res) => {
    try {
      await userModel.find(async () => {
        const token = req.headers.authorization;
        // const verify = jwt.verify(token, salt);
        // console.log(verify);
        console.log(token, "tokrn");
        if (!token) {
          res.send("you dont have permission");
          return;
        }

        const decodedToken = jwt.decode(token);
        console.log(decodedToken);
        const user = await userModel.findById(decodedToken.sub);
        if (!user) {
          res.send("you dont have permisson");
        }
        // jwt.verify(token, salt);
        res.send(user);
      });
    } catch (error) {
      console.log(error, "error");
      // res.status(401).send({ error: error });
    }
  });

  app.post("/register", urlencodedParser, async (req, res) => {
    const { username, email, password } = req.body;
    const bodySchema = Joi.object({
      email: Joi.string().email().required(),
      username: Joi.string().required(),
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
        password,
      });

      await newUser.save();

      res.send(newUser);
    } catch (error) {
      res.statusCode = 400;
      res.send(error.message);
    }
  });
  app.post("/login", urlencodedParser, async (req, res) => {
    try {
      const { email, password } = req.body;

      console.log(req.body, "req.body");
      const userAcc = await userModel.findOne({ email });

      if (!userAcc) {
        res.statusCode(404);

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
  app.post("/completed/:id" , async(req,res) => {
    const {id} = req.params
    
    try {
      const theUser = await userModel.findById(id);
      if(req.query.title) {
        const lesson = theUser.Courses.filter((lesson) => lesson.title == req.query.title);

        const index = theUser.Courses.indexOf(lesson[0]);

        theUser.Courses[index].completed = {$set : [{ completed : true}]};

        res.send(lesson)
      }else{
        res.statusCode = 403;
        res.send("There's something wrong !")
      }
    } catch (error) {
      console.log(error);
    }
  });
  app.get("/Courses/:id" , async (req,res) =>{
    const {id} = req.params;
    try {
      const user = await userModel.findById(id);
      res.send(user.Courses)
    } catch (error) {
      console.log(error)
    }
    
  })
}

module.exports = setUpRoutes;

//////////////////////////////
////code i might use//////////
//////////////////////////////