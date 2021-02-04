const Category = require("../models/Category");

exports.getCategories = (req, res) => {
  /* const categories = Category.find();
  return res.json(categories); */
  Category.find().exec((err,category)=>{
    return res.status(200).json(category)
  })
};

exports.getCategoryById=async(req,res)=>{
  try {
    const category = await Category.findById(req.params.categoryId)
    res.status(200).json({ success: true,category:category });
  } catch ({ error, message }) {
    res.status(400).json({ error, message:"Aucune catégorie trouvé" });
  }
}

exports.addCategorie = async (req, res) => {
  const { categoryName, imageUrl } = req.body.categorieFields;
  try {
    Category.findOne({ categoryName }).exec((err, category) => {
      if (category) {
        return res.status(401).json({
          error: "This category already exist",
        });
      }
    });

    const newCategory = new Category({ categoryName, imageUrl });
    newCategory.save((err, result) => {
      if (err) {
        return res.status(401).json({
          error: "Error saving category in database. Try later",
        });
      }
      return res.status(200).json({
        message: "Category have been successfully saved.",
      });
    });
  } catch ({ error, message }) {
    res.status(400).json({ error, message });
  }
};
