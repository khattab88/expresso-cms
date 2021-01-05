import "@babel/polyfill";
import { login, logout } from "./login";
import { displayMap } from "./mapbox";
import { updateAccount } from "./account";

// DOM ELEMENTS
const loginForm = document.querySelector("#login-form");
const logoutBtn = document.querySelector("#logout-btn");
const map = document.querySelector("#map");
const accountDataForm = document.querySelector("#account-data-form");
const accountPasswordForm = document.querySelector("#account-password-form");


// DELEGATION
if (loginForm) {
    loginForm.addEventListener("submit", e => {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        
        login(email, password);
    });
}

if(logoutBtn) {
    logoutBtn.addEventListener("click", logout);
}

if (map) {
    var location = map.dataset.location;
    location = location.split`,`.map(x => +x);

    displayMap(location);
}

if(accountDataForm) {
    accountDataForm.addEventListener("submit", e => {
        e.preventDefault();

        const firstName = document.getElementById("firstName").value;
        const lastName = document.getElementById("lastName").value;
        const email = document.getElementById("email").value;

        updateAccount("data", { firstName, lastName, email });
    });
}

if(accountPasswordForm) {
    accountPasswordForm.addEventListener("submit", async e => {
        e.preventDefault();

        document.getElementById("change-password-btn").textContent = "Updating...";
        const currentPassword = document.getElementById("currentPassword").value;
        const newPassword = document.getElementById("newPassword").value;
        const newPasswordConfirm = document.getElementById("newPasswordConfirm").value;

        await updateAccount("password", { currentPassword, newPassword, newPasswordConfirm});

        document.getElementById("change-password-btn").textContent = "Change Password";
        document.getElementById("currentPassword").value = "";
        document.getElementById("newPassword").value = "";
        document.getElementById("newPasswordConfirm").value = "";
    });
}