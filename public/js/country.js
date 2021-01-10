import axios from 'axios';
import { showAlert } from "./alerts";

export const updateCountry = async data => {
    try {
        const res = await axios({
            method: 'PATCH',
            url: `http://127.0.0.1:3000/api/v1/countries/${data.id}`,
            data,
        });

        if(res.data.status === "success") {
            showAlert("success", `Country updated successfully!`);
            window.setTimeout(() => {
                window.location.reload();
            }, 1500);
        }
    } catch (err) {
        showAlert("error", err.response.data.message);
    }
};