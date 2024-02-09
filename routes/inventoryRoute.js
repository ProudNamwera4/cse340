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
router.get(
  "/management",
  utilities.checkAccountType,
  invController.buildManagement
);

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

//process the route and return the data as JSON.
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
);

//route to edit inventory item
router.get(
  "/edit-inventory/:inv_id",
  utilities.handleErrors(invController.modifyInventory)
);

//route to update inventory item
router.post(
  "/update/",
  addVehicleValidate.addVehicleRules(),
  addVehicleValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);

//route to delete inventory item
router.get(
  "/delete-confirm/:inv_id",
  utilities.handleErrors(invController.deleteInventoryItem)
);

//route to delete from database
router.post("/delete/", utilities.handleErrors(invController.deleteInventory));

module.exports = router;
