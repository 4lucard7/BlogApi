const router = require("express").Router();
const { createPost, getAllPost, getSinglePost, getCountPost, getDeletePost, updatePost, updateImagePost, toggleLike } = require("../controllers/postController");
const photoUpload = require("../middlewares/photoUpload");
const validationObjectId = require("../middlewares/validationObjectId");
const { verfiyToken } = require("../middlewares/verifyToken");







//api/post
router.post("/", verfiyToken, photoUpload.single("image"), createPost);
router.get("/", getAllPost);
router.get("/:id", validationObjectId,getSinglePost);
router.get("/count", getCountPost);
router.delete("/:id", validationObjectId, verfiyToken, getDeletePost);
router.put("/:id", validationObjectId, verfiyToken, updatePost);

// api/post/update-image/:id
router.put("/update-image/:id", verfiyToken, photoUpload.single("image"), updateImagePost);

// api/post/like/:id
router.put("/like/:id", verfiyToken, validationObjectId, toggleLike);


module.exports = router;