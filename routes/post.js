const router = require("express").Router();
const { createPost } = require("../controllers/postController");
const photoUpload = require("../middlewares/photoUpload");
const { verfiyToken } = require("../middlewares/verifyToken");







//api/post
router.post("/", verfiyToken, photoUpload.single("image"), createPost)




module.exports = router;