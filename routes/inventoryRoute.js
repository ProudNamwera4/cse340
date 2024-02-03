// Needed Resources
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

//Route to build a specific inventory item detail view.
router.get("/detail/:inventoryId", invController.buildByInventoryId);

//Route to build the management view.
router.get("/management", invController.buildManagement);

//Route to build the add classification view.
router.get("/add-classification", invController.buildAddClassification);

//Route to add specific classification.
router.post("/add-classification", invController.addNewClassification);

//Route to add specific vehicle.
router.get("/add-inventory", invController.buildAddInventory);

module.exports = router;