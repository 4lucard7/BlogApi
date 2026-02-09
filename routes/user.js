const { getAllUsers, getUser, updateUser, getUsersCount, profilePhotoUpload } = require("../controllers/usersController");
const photoUpload = require("../middlewares/photoUpload");
const validationObjectId = require("../middlewares/validationObjectId");
const {verfiyTokenAndAdmin, verfiyTokenAndOnlyUser, verfiyToken} = require("../middlewares/verifyToken");
const router = require("express").Router();



//api/users/profiles
router.get("/profiles", verfiyTokenAndAdmin, getAllUsers);

//api/users/profile/:id
router.get("/profile/:id", validationObjectId, getUser);

//api/users/profile/:id
router.put("/profile/:id", validationObjectId, verfiyTokenAndOnlyUser, updateUser);



//api/users/count
router.get("/count", verfiyTokenAndAdmin, getUsersCount);

//api/users/profile/profile-photo-upload
router.post("/profile/profile-photo-upload", photoUpload.single("image"),verfiyToken,profilePhotoUpload );


module.exports = router;