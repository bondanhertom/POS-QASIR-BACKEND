const express = require("express");
const router = express.Router();
const ControllerUser = require("../controllers/controllerUser");
const ControllerProduct = require("../controllers/controllerProduct");
const ControllerRawMaterial = require("../controllers/controllerRawMaterial");
const ControllerRecipe = require("../controllers/controllerRecipe");
const ControllerPendingOrder = require("../controllers/controllerPendingOrder");
const { authentication } = require("../middlewares/authentication");

router.post("/register", ControllerUser.register);
router.post("/login", ControllerUser.login);

router.post("/category", authentication, ControllerProduct.cretaeCategory);
router.post("/product", authentication, ControllerProduct.cretaeProduct);
router.post(
  "/rawmaterial",
  authentication,
  ControllerRawMaterial.cretaeRawMaterial
);
router.post("/recipe", authentication, ControllerRecipe.cretaeRecipe);
router.post(
  "/orders",
  authentication,
  ControllerPendingOrder.cretaePendingOrder
);

router.get("/category", authentication, ControllerProduct.getCategory);
router.get("/product", authentication, ControllerProduct.getProduct);
router.get("/order", authentication, ControllerPendingOrder.getOrder);

router.delete("/order/:id", authentication, ControllerPendingOrder.deleteOrder);
router.delete("/product/:id", authentication, ControllerProduct.deleteProduct);

module.exports = router;
