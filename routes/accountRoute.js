// Needed Resources
const express = require("express")
const router = new express.Router() 
const accController = require("../controllers/accountController")
const utilities = require("../utilities") 

// Route to build My Account login view
router.get("/login", utilities.handleErrors(accController.buildLogin))

// Route to build My registration view
router.get("/registration", utilities.handleErrors(accController.buildRegistration))


module.exports = router;