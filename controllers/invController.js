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
      title: classYear + "" + classMake + "" + classModel,
      nav,
      grid2,
    });
  }else {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
  }
};

module.exports = invCont;
