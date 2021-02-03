const express = require("express");
const router = express.Router();

const {
    userById,
  userSignin,
  userEmailConfirmation,
  userSignup,
  userPasswordUpdate,
  userAddressUpdate
} = require("../controllers/user");

router.get("/user/get/:userId",userById)
router.post("/login/user", userSignin);
router.post("/user/confirmation", userEmailConfirmation);
router.post("/user/signup", userSignup);
router.put("/user/password-update", userPasswordUpdate);
router.put("/user/address-update/:userId", userAddressUpdate);
//router.get("/project/:projectId",readProject)

/* router.param("userId", userById); */
module.exports = router;
