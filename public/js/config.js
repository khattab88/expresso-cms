import axios from "axios";

export const config = async () => {
    const res = await axios({
        method: 'GET',
        url: "/config"
    });

    const config = res.data;
    // console.log(config);

    window.localStorage.setItem("expresso", JSON.stringify(config));
};