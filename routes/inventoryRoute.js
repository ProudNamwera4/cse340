// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const addVehicleValidate = require("../utilities/inventory-validation");
const classificationValidate = require("../utilities/inventory-validation");
const utilities = require("../utilities");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

//Route to build a specific inventory item detail view.
router.get("/detail/:inventoryId", invController.buildByInventoryId);

//Route to build the management view.
router.get("/management", invController.buildManagement);

//Route to build the add classification view.
router.get("/add-classification", invController.buildAddClassification);

//Route to add specific classification.
router.post(
  "/add-classification",
  classificationValidate.classificationRules(),
  classificationValidate.checkClassificationData,
  utilities.handleErrors(invController.addNewClassification)
);

//Route to build add vehicle view.
router.get("/add-inventory", invController.buildAddInventory);

// Process the add vehicle data
router.post(
  "/add-inventory",
  addVehicleValidate.addVehicleRules(),
  addVehicleValidate.checkAddVehicleData,
  utilities.handleErrors(invController.addInventoryVehicle)
);

module.exports = router;
