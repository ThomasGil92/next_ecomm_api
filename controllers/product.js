const Product = require("../models/Product");

exports.getProducts = async (req, res) => {
  const products = await Product.find().populate("categorie");
  return res.json(products);
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.body.toUpdate._id },
      {
        $set: req.body.toUpdate,
      },
    );
    if (!product) {
      console.log("Product not found");
    }
    console.log(product);
    return res.status(200).json({
      product,
    });
  } catch (err) {
    res.status(400).json(err);
    console.log(err);
  }
};

exports.updateStockProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.body.product._id },
      product.stock - req.body.product.quantityInCart,
    );
    if (!product) {
      console.log("Product not found");
    }
    console.log(product);
    return res.status(200).json({
      product,
    });
  } catch (err) {
    res.status(400).json(err);
    console.log(err);
  }
};

exports.addProduct = async (req, res) => {
  const {
    productName,
    price,
    description,
    stock,
    categorie,
    imageUrl,
  } = req.body.productFields;
  try {
    Product.findOne({ productName }).exec((err, product) => {
      if (product) {
        return res.status(401).json({
          error: "This product already exist",
        });
      }
    });

    const newProduct = new Product({
      productName,
      price,
      description,
      stock,
      categorie,
      imageUrl,
    });
    newProduct.save((err, result) => {
      if (err) {
        return res.status(401).json({
          error: "Error saving product in database. Try later",
        });
      }
      return res.status(200).json({
        message: "Product have been successfully saved.",
      });
    });
  } catch ({ error, message }) {
    res.status(400).json({ error, message });
  }
};
