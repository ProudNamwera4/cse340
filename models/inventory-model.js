const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query('SELECT * FROM public.classification ORDER BY classification_name')
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Retrieve the data for a specific vehicle in inventory, based on the inventory id 
 * ************************** */
async function getInventoryByInvId(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
      WHERE i.inv_id = $1`,
      [inv_id]
    )
    return data.rows
  } catch (error) {
    console.error("getinvbyid error " + error)
  }
}

async function addClassification(classification_name){
  try {
    const sql = "INSERT INTO public.classification(classification_name) VALUES ($1);"
    return await pool.query(sql, [classification_name])
  } catch (error) {
    return error.message
  }
}


/*************************************
 * Check for existsing classifications
 *************************************/
async function checkExistingClassification(classification_name) {
  try {
    const sql = "SELECT * FROM classification WHERE classification_name = $1"
    const name = await pool.query(sql, [classification_name])
    return name.rowCount
  } catch (error) {
    return error.message
  }
}


/* *****************************
*   add new vehicle
* *************************** */
async function addVehicleData(inv_make, inv_model,inv_year,inv_description,inv_image,inv_thumbnail,inv_price,inv_miles,inv_color,classification_id) {
  try {
    const sql = "INSERT INTO public.inventory(inv_make, inv_model,inv_year,inv_description,inv_image,inv_thumbnail,inv_price,inv_miles,inv_color,classification_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10);"
    return await pool.query(sql, [inv_make, inv_model,inv_year,inv_description,inv_image,inv_thumbnail,inv_price,inv_miles,inv_color,classification_id])
  } catch (error) {
    console.log(error.message)
  }
}


module.exports = {getInventoryByInvId,getClassifications, getInventoryByClassificationId,checkExistingClassification,addClassification,addVehicleData};