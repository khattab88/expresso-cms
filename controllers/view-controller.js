/* eslint-disable prettier/prettier */
const { catchAsync } = require('expresso-utils');
const { Tag } = require('expresso-models');
const { tagRepository } = require("expresso-repositories");

exports.getDashboardView = catchAsync(async (req, res, next) => {
    res.status(200).render("dashboard", {
        title: "Dashboard"
    });
});

exports.getTagsView = catchAsync(async (req, res) => {

    // 1. get data
    const tags = await tagRepository.getAll();

    // 2. build template

    // 3. render template using data

    res.status(200).render("tags", {
        title: "Tags",
        tags
    });
});