const router = require("express").Router()
const { createCategoryController, getAllCategoriesController, deleteCategoryController } = require("../controllers/categoryController");
const validationObjectId = require("../middlewares/validationObjectId");
const { verfiyTokenAndAdmin } = require("../middlewares/verifyToken");

//create new category
router.post("/", verfiyTokenAndAdmin, createCategoryController);
router.get("/", getAllCategoriesController)
router.delete("/:id", validationObjectId, verfiyTokenAndAdmin, deleteCategoryController)



module.exports = router;