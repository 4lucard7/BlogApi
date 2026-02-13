const router = require('express').Router();
const { createComment, updateComment, deleteComment, getAllComments } = require('../controllers/commentController');
const validationObjectId = require('../middlewares/validationObjectId');
const { verfiyToken, verfiyTokenAndAdmin } = require('../middlewares/verifyToken');

//api/comments
router.post("/",verfiyToken ,createComment);
router.get("/", verfiyTokenAndAdmin, getAllComments);

router.put("/:id",verfiyToken ,updateComment);

router.delete("/:id",validationObjectId, verfiyToken ,deleteComment);


module.exports = router;