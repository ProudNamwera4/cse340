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
  } else {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
  }
};

/* ****************************************
 *  Build Management view
 * *************************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  const { classification_id } = req.body;

  const id = classification_id;
  const list = await utilities.buildDropDown(id);

  res.render("inventory/management", {
    title: "Vehicle Management",
    nav,
    list,
    errors: null,
  });
};

/* ****************************************
 *  Build Add Classification view
 * *************************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  });
};

/* ****************************************
 *  Process adding a classification
 * *************************************** */
invCont.addNewClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  const { classification_name } = req.body;

  const addClassResult = await invModel.addClassification(classification_name);

  if (addClassResult) {
    req.flash(
      "notice",
      `The ${classification_name} classification was successfully added.`
    );
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the classification addition failed.");
    res.status(501).render("inventory/add-classification", {
      title: "New Classification",
      nav,
      errors: null,
    });
  }
};

/* ****************************************
 *  Build Add Inventory view
 * *************************************** */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const list = await utilities.buildDropDown();
  res.render("inventory/add-inventory", {
    title: "Add Vehicle",
    nav,
    list,
    errors: null,
  });
};

/* ****************************************
 *  Process new vehicle
 * *************************************** */
invCont.addInventoryVehicle = async function (req, res) {
  let nav = await utilities.getNav();
  
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
  const id = classification_id;
  const list = await utilities.buildDropDown(id);
  const addVehicleResult = await invModel.addVehicleData(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  );

  if (addVehicleResult) {
    req.flash("notice",
      `Congratulations, you've added ${inv_make} ${inv_model}.`
    );
    res.status(201).render("inventory/management", {
      title: "Vehicle Managenent",
      nav,
      list,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, adding a vehicle failed.");
    res.status(501).render("inventory/add-inventory", {
      title: "Add Vehicle error",
      nav,
      list,
      errors: null,
    });
  }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}


/************************************
  * Modify inventory item
  ***********************************/
invCont.modifyInventory = async (req, res, next) => {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryByInvId(inv_id)
  const selection = parseInt(itemData[0].classification_id)
  const list = await utilities.buildDropDown(selection)
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
 res.render("./inventory/edit-inventory", {
   title: "Modify " + itemName,
   nav,
   list: list,
   errors: null,
   inv_id: itemData[0].inv_id,
   inv_make: itemData[0].inv_make,
   inv_model: itemData[0].inv_model,
   inv_year: itemData[0].inv_year,
   inv_description: itemData[0].inv_description,
   inv_image: itemData[0].inv_image,
   inv_thumbnail: itemData[0].inv_thumbnail,
   inv_price: itemData[0].inv_price,
   inv_miles: itemData[0].inv_miles,
   inv_color: itemData[0].inv_color,
   classification_id: selection
 })
}


/* ****************************************
 *  Update Inventory Data
 * *************************************** */
invCont.updateInventory = async function (req, res) {
  let nav = await utilities.getNav();
  
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id, 
  );

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/management")
  } else {
    const id = classification_id;
    const classificationSelect = await utilities.buildDropDown(classification_id)
    const list = await utilities.buildDropDown(id);
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    list,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}


module.exports = invCont;