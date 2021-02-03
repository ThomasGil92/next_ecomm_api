const express = require("express");
const router = express.Router();

const {
  orderById,
  getOrder,
  getOrders,
  getSessionCheckoutResult,
  sendConfirmationEmail,
  saveNewOrder,
  createSession,
} = require("../controllers/order");
/* const {
    requireSignin,
    isAuth
} = require('../controllers/auth'); */
/* const {
    userById
} = require('../controllers/user'); */

router.get("/user/order/:order_id", getOrder);
router.get("/orders/get", getOrders);
router.post("/checkout/createSession", createSession);
router.get("/checkout/session/:csById", getSessionCheckoutResult);
router.post("/checkout/session/emailSuccess", sendConfirmationEmail);
router.post("/orders/saveNewOrder", saveNewOrder);
//router.get("/project/:projectId",readProject)

router.param("order_id", orderById);
/*router.param("userId", userById); */
module.exports = router;
