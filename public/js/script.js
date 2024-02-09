document.querySelector("#showPassword").addEventListener("click", function (){
    var s = document.getElementById("account_password");
    if (s.type === "password") {
        s.type = "text";
    } else {
        s.type = "password";
    }
});