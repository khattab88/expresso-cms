/* eslint-disable prettier/prettier */
exports.getDashboardView = (req, res) => {
    res.status(200).render("dashboard", {
        title: "Dashboard"
    });
};

exports.getTagsView = (req, res) => {
    res.status(200).render("tags", {
        title: "Tags"
    });
};