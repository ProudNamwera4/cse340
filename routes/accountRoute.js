// Needed Resources
const express = require("express")
const router = new express.Router() 
const accController = require("../controllers/accountController")
const utilities = require("../utilities") 
const regValidate = require('../utilities/account-validation')
const loginValidate = require('../utilities/account-validation')
// Route to build My Account login view
router.get("/login", utilities.handleErrors(accController.buildLogin))

// Route to build My registration view
router.get("/registration", utilities.handleErrors(accController.buildRegistration))


// Process the registration data
router.post(
    "/registration",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accController.registerAccount)
  )

  // Process the login attempt
router.post(
  "/login",
  loginValidate.loginRules(),
  loginValidate.checkLoginData,
  utilities.handleErrors(accController.accountLogin)
)

// Route to build Account Management view
router.get("/", utilities.handleErrors(accController.buildManagement))

module.exports = router;