
/* ****************************************
 *  Add Logout
 * ************************************ */
async function addLogout (req, res){
    if (res.locals.loggedin) {
      const logoutBtn = document.querySelector("#logout");
      logoutBtn.addEventListener("click", function () {
        res.locals.loggedin = false;
        req.redirect('/');
      });
    }
  };

addLogout();