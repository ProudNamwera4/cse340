const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.inventoryId;
  const data = await invModel.getInventoryByInvId(inv_id);
  if (data.length > 0) {
    const grid2 = await utilities.buildInventoryGrid(data);
    let nav = await utilities.getNav();
    const classYear = data[0].inv_year;
    const classMake = data[0].inv_make;
    const classModel = data[0].inv_model;

    res.render("./inventory/inventory", {
      title: classYear + " " + classMake + " " + classModel,
      nav,
      grid2,
    });
  }else {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
  }
};

/* ****************************************
*  Build Management view
* *************************************** */
invCont.buildManagement = async function (req, res, next)  {
  let nav = await utilities.getNav()
  res.render("inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Build Add Classification view
* *************************************** */
invCont.buildAddClassification = async function (req, res, next)  {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process adding a classification
* *************************************** */
invCont.addNewClassification = async function (req, res, next)  {
  let nav = await utilities.getNav()
  const {classification_name} = req.body

  const addClassResult = await invModel.addClassification(
    classification_name,
  )

  if (addClassResult) {
    req.flash(
      "notice",
      `The ${classification_name} classification was successfully added.`
    )
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the classification addition failed.")
    res.status(501).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
    })
  }
}

/* ****************************************
*  Build Add Inventory view
* *************************************** */
invCont.buildAddInventory = async function (req, res, next)  {
  let nav = await utilities.getNav()
  res.render("inventory/add-inventory", {
    title: "Add Vehicle",
    nav,
    errors: null,
  })
}




module.exports = invCont;
