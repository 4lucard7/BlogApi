const router = require("express").Router();
const {signupUserController, loginUserController} = require("../controllers/authController")


//api7auth/signup
router.post("/signup", signupUserController);

//api7auth/login
router.post("/login", loginUserController);


module.exports = router; 