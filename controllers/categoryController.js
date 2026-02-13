const asyncHandler = require("express-async-handler")
const { Category, validateCategory } = require("../models/Category")



/**
 * @description create new category
 * @route /api/categories
 * @method POST
 * @access private (admin only)
 */
const createCategoryController = asyncHandler(async (req, res) => {
    const { error } = validateCategory(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const category = await Category({
        userId: req.user.id,
        title: req.body.title,
    });

    await category.save();
    
    res.status(201).json({ 
        message: "Category created successfully", 
        category 
    });
});

/**
 * @description get allcategory
 * @route /api/categories
 * @method GET
 * @access public
 */
const getAllCategoriesController = asyncHandler(async (req, res) => {
    const categories = await Category.find().populate("userId", "username")
    res.status(200).json({ message: "Categories fetched successfully", categories })
})

/**
 * @description delete category
 * @route /api/categories/:id
 * @method DELETE
 * @access private (admin only)
*/
const deleteCategoryController = asyncHandler(async (req, res) => {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
        return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted successfully" });
});



module.exports = {
    createCategoryController,
    getAllCategoriesController,
    deleteCategoryController
}