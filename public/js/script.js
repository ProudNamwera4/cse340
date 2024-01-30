const showPasswordBtn = document.getElementById("#showPassword");


function showPassword() {
    const password = document.getElementById("account_password");
    const passType = document.getAttribute("type");
    if (passType == "password"){
        passType = "text";
        showPasswordBtn.innerHTML = "Hide Password";
    } else {
        password.type = "password";
        showPasswordBtn.innerHTML = "Hide Password";
    }
}

showPasswordBtn.addEventListener("click",showPassword());
