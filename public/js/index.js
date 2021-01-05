import "@babel/polyfill";
import { login, logout } from "./login";
import { displayMap } from "./mapbox";
import { updateAccountData } from "./account";

// DOM ELEMENTS
const loginForm = document.querySelector("#login-form");
const logoutBtn = document.querySelector("#logout-btn");
const map = document.querySelector("#map");
const accountDataForm = document.querySelector("#update-data-form");


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

        updateAccountData(firstName, lastName, email);
    });
}