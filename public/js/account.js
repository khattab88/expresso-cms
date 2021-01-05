import axios from 'axios';
import { showAlert } from "./alerts";

// type is either data or password
export const updateAccount = async (type, data) => {
    try {
        const endpoint = (type === "data") ? "updateMe" : "changePassword";

        const res = await axios({
            method: 'PATCH',
            url: `http://127.0.0.1:5000/api/v1/auth/${endpoint}`,
            data
        });

        if(res.data.status === "success") {
            showAlert("success", `${type.toUpperCase()} updated successfully!`);
        }
    } catch (err) {
        showAlert("error", err.response.data.message);
    }
};