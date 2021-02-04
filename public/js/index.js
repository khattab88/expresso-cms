import "@babel/polyfill";
import { login, logout } from "./login";
import { displayMap } from "./mapbox";
import { updateAccount } from "./account";
// import { updateCountry } from "./country";
// import { checkout } from "./checkout";
import { config } from "./config";

// configure app variables (client-side)
// config();

// DOM ELEMENTS
const loginForm = document.querySelector("#login-form");
const logoutBtn = document.querySelector("#logout-btn");

const map = document.querySelector("#map");

const accountDataForm = document.querySelector("#account-data-form");
const accountPasswordForm = document.querySelector("#account-password-form");

const updateCountryForm = document.querySelector("#update-country-form");

const checkoutBtn = document.querySelector("#checkout-btn");

// DELEGATION
if (loginForm) {
    loginForm.addEventListener("submit", e => {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        login(email, password);
    });
}

if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
}

if (map) {
    var location = map.dataset.location;
    location = location.split`,`.map(x => +x);

    displayMap(location);
}

if (accountDataForm) {
    accountDataForm.addEventListener("submit", e => {
        e.preventDefault();

        const firstName = document.getElementById("firstName").value;
        const lastName = document.getElementById("lastName").value;
        const email = document.getElementById("email").value;

        updateAccount("data", { firstName, lastName, email });
    });
}

if (accountPasswordForm) {
    accountPasswordForm.addEventListener("submit", async e => {
        e.preventDefault();

        document.getElementById("change-password-btn").textContent = "Updating...";
        const currentPassword = document.getElementById("currentPassword").value;
        const newPassword = document.getElementById("newPassword").value;
        const newPasswordConfirm = document.getElementById("newPasswordConfirm").value;

        await updateAccount("password", { currentPassword, newPassword, newPasswordConfirm });

        document.getElementById("change-password-btn").textContent = "Change Password";
        document.getElementById("currentPassword").value = "";
        document.getElementById("newPassword").value = "";
        document.getElementById("newPasswordConfirm").value = "";
    });
}

/* UNNECESSARY */
if (updateCountryForm) {
    updateCountryForm.addEventListener("submit", async e => {
        e.preventDefault();

        const form = new FormData();
        form.append("id", document.getElementById("id").value);
        form.append("name", document.getElementById("name").value);
        form.append("alias", document.getElementById("alias").value);
        form.append("currency", document.getElementById("currency").value);

        const data = {
            id: document.getElementById("id").value,
            name: document.getElementById("name").value,
            alias: document.getElementById("alias").value,
            currency: document.getElementById("currency").value
        };

        // console.log(data);
        // console.log(document.cookie);

        // updateCountry(data);
    });
}

// if(checkoutBtn) {
//     checkoutBtn.addEventListener("click", e => {
//         e.target.textContent = "Processing...";

//         const { orderId } = e.target.dataset;
//         // console.log(orderId);
//         checkout(orderId);
//     });
// }

