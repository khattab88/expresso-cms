export const hideAlert = () => {
    const el = document.querySelector(".alert");
    if(el) el.parentElement.removeChild(el);
};

export const showAlert = (type, msg) => {
    hideAlert();

    // type is "success" or "error"
    const alertType = type === "success" ? "success" : "danger";
    const markup = `<div class="alert alert-${alertType}">${msg}</div>`;
    document.querySelector("body").insertAdjacentHTML('afterbegin', markup);

    window.setTimeout(hideAlert, 1500);
};
