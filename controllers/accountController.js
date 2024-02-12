const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
//require the "jsonwebtoken" and "dotenv" packages
const jwt = require("jsonwebtoken");
require("dotenv").config();

const accCont = {};

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegistration(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/registration", {
    title: "Registration",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration ."
    );
    res.status(500).render("account/registration", {
      title: "Registration",
      nav,
      errors: null,
    });
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you have registered ${account_firstname}. Please login.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/registration", {
      title: "Registration",
      nav,
      errors: null,
    });
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 }
      );
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      return res.redirect("/account/");
    }
  } catch (error) {
    return new Error("Access Forbidden");
  }
}

/* ****************************************
 *  Deliver Management view
 * *************************************** */
async function buildManagement(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/", {
    title: "Account Management",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Deliver account update view
 * *************************************** */
async function buildUpdateAccount(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/update", {
    title: "Update Account",
    nav,
    errors: null,
  });
}

/*******************************
 * Update Account
 ****************************/
async function updateAccInfo(req, res) {
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_id } =
    req.body;
  const accData = await accountModel.getAccountById(account_id);
  const regResult = await accountModel.editAccountInfo(
    account_firstname,
    account_lastname,
    account_email,
    account_id
  );
  if (regResult) {
    req.flash("notice", "You have updated your information.");
    res.status(201).render("account/", {
      title: "Account Management",
      nav,
      errors: null,
      account_firstname: accData.account_firstname,
      account_lastname: accData.account_lastname,
      account_email: accData.account_email,
      account_id,
    });
  } else {
    req.flash("notice", "Sorry, update failed.");
    res.status(501).render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
    });
  }
}

/*******************************
 * Update Password
 ****************************/
async function updatePassword(req, res) {
  let nav = await utilities.getNav();
  const { account_password, account_id } = req.body;
  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash("notice", "Sorry, there was an error changing your password.");
    res.status(500).render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
    });
  }

  const regResult = await accountModel.changePassword(
    hashedPassword,
    account_id
  );
  if (regResult) {
    req.flash("notice", "You have successfully updated your password.");
    res.status(201).render("account/", {
      title: "Account Management",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the password change failed.");
    res.status(501).render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
    });
  }
}

/* ****************************************
 *  Deliver logout
 * *************************************** */
async function logout(req, res) {
  res.clearCookie("jwt");
  res.locals.loggedin = 0;
  req.flash("You are logged out.");
  res.redirect("/");
};

module.exports = {
  buildLogin,
  buildRegistration,
  registerAccount,
  accountLogin,
  buildManagement,
  buildUpdateAccount,
  updateAccInfo,
  updatePassword,
  logout,
};
