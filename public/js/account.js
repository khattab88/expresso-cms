import axios from 'axios';
import { showAlert } from "./alerts";

export const updateAccountData = async (firstName, lastName, email) => {
    try {
        const res = await axios({
            method: 'PATCH',
            url: 'http://127.0.0.1:5000/api/v1/auth/updateMe',
            data: {
                firstName,
                lastName,
                email
            }
        });

        if(res.data.status === "success") {
            showAlert("success", "data updated successfully!");
        }
    } catch (err) {
        showAlert("error", err.response.data.message);
    }
};