const express = require("express");
const router = express.Router();

const { getProducts,updateProduct,addProduct,updateStockProduct } = require("../controllers/product");
/* const {
    requireSignin,
    isAuth
} = require('../controllers/auth'); */
/* const {
    userById
} = require('../controllers/user'); */

router.get("/product/get", getProducts);
router.put("/product/update", updateProduct);
router.put("/products/productStockUpdate", updateStockProduct);
router.post("/product/add", addProduct);
//router.get("/project/:projectId",readProject)
/*router.param("userId", userById); */
module.exports = router;
