import axios from "axios";
import { showAlert } from "./alerts";

export const login = async (email, password) => {
    // console.log(email, password);

    try {
        const res = await axios({
            method: 'POST',
            url: '/api/v1/auth/loginadmin',
            data: {
                email, password
            }
        });

        if(res.data.status === "success") {
            showAlert("success", "logged in successfully!");
            window.setTimeout(() => {
                window.location.assign("/");
            }, 1500);
        }
    } catch (err) {
        showAlert("error", err.response.data.message);
    }
};

export const logout = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: 'http://127.0.0.1:5000/api/v1/auth/logout'
        });

        if(res.data.status === "success") {
            window.location.assign("/login");
        }
    } catch (err) {
        showAlert("error", "Error logging out, try again!");
    }
};