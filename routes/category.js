const express = require("express");
const router = express.Router();

const { getCategories,addCategorie,getCategoryById } = require("../controllers/category");
/* const {
    requireSignin,
    isAuth
} = require('../controllers/auth'); */
/* const {
    userById
} = require('../controllers/user'); */

router.get("/category/:categoryId", getCategoryById);
router.get("/categories/get", getCategories);
router.post("/categorie/add", addCategorie);
//router.get("/project/:projectId",readProject)
/*router.param("userId", userById); */
module.exports = router;
