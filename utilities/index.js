const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid=''
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_image
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
      
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Take the specific vehicle's information and wrap
* it up in HTML to deliver to the view
* ************************************ */
Util.buildInventoryGrid = async function(data){
  let grid=""
  if(data.length > 0){
    grid = '<div id="detail-display">'
    data.forEach(vehicle => { 
      grid += '<img src="' + vehicle.inv_image 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        + ' on CSE Motors" />'
      grid += '<div id="info">'
      grid += '<h2 id="vehicleName">' + vehicle.inv_make + ' ' + vehicle.inv_model + '</h2>'
      grid += '<p id="descriptionTag"> <strong>Description: </strong>'
      grid += '<span id="description">' + vehicle.inv_description + '</span>'
      grid += '</p>'
      grid += '<p id="priceTag"> <strong>Price: '  
      grid += '<span id="price">$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span></strong>'
      grid += '</p>'
      grid += '<p id="mileTag"><strong> Mileage: </strong>'
      grid += '<span id="mileage">' + new Intl.NumberFormat('en-US').format(vehicle.inv_miles) + '</span>'
      grid += '</p>'
      grid += '<p id="colorTag"><strong> Color: </strong>'
      grid += '<span id="color">' + vehicle.inv_color + '</span>'
      grid += '</p>'
      grid += '</div>'
    })
    grid += '</div>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/********************************
 * Build classification drop down menu
 ***********************************/
/********************************
 * Build classification drop down menu
 ***********************************/
Util.buildDropDown = async function(selection) {
  let data = await invModel.getClassifications()
  let list 
  list += '<option selected value="">Select A Classification</option>'
  data.rows.forEach((row) => {   
    if (selection == row.classification_id) {
      list += '<option></option>'
      list += '<option value="' + row.classification_id + '" selected="selected">'
      list += row.classification_name
      list += "</option>"
    }
     list += '<option value="' + row.classification_id + '">'
     list += row.classification_name
     list += "</option>"
})
  list += "</select>"
   
  return list
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util