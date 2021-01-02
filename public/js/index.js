import "@babel/polyfill";
import { login } from "./login";
import { displayMap } from "./mapbox";

// DOM ELEMENTS
const loginForm = document.querySelector("#login-form");
const map = document.querySelector("#map");


// DELEGATION
if (loginForm) {
    loginForm.addEventListener("submit", e => {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        
        login(email, password);
    });
}

if (map) {
    var location = map.dataset.location;
    location = location.split`,`.map(x => +x);

    displayMap(location);
}
