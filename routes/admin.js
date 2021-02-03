const express = require("express");
const router = express.Router();

const {
  getAdminById,
  activateAdmin,
  updateEmail,
  updatePassword,
  adminSignin
} = require("../controllers/admin");

router.get("/admin/:adminId", getAdminById);
router.post("/admin/adminSignin", adminSignin);
router.post("/admin/activateAdmin", activateAdmin);
router.put("/admin/updateEmail", updateEmail);
router.put("/admin/updatePassword", updatePassword);

module.exports = router;
