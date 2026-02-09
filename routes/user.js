const { getAllUsers, getUser, updateUser, getUsersCount } = require("../controllers/usersController");
const validationObjectId = require("../middlewares/validationObjectId");
const {verfiyTokenAndAdmin, verfiyTokenAndOnlyUser} = require("../middlewares/verifyToken");
const router = require("express").Router();



//api/users/profiles
router.get("/profiles", verfiyTokenAndAdmin, getAllUsers);

//api/users/profile/:id
router.get("/profile/:id", validationObjectId, getUser);

//api/users/profile/:id
router.put("/profile/:id", validationObjectId, verfiyTokenAndOnlyUser, updateUser);



//api/users/count
router.get("/count", verfiyTokenAndAdmin, getUsersCount);


module.exports = router;