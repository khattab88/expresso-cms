/* eslint-disable prettier/prettier */
const { catchAsync } = require('expresso-utils');
const { Tag, Country, City, Area } = require('expresso-models');
const { tagRepository, countryRepository, cityRepository, areaRepository } = require("expresso-repositories");

exports.getDashboardView = catchAsync(async (req, res, next) => {
    res.status(200).render("dashboard", {
        title: "Dashboard"
    });
});

exports.getTagListView = catchAsync(async (req, res) => {

    const tags = await tagRepository.getAll();

    res.status(200).render("tag-list", {
        title: "Tags",
        tags
    });
});

exports.getCountryListView = catchAsync(async (req, res, next) => {

    const countries = await countryRepository.getAll();

    res.status(200).render("country-list", {
        title: "Countries",
        countries
    });
});

exports.getCityListView = catchAsync(async (req, res, next) => {

    const cities = await cityRepository.getAll();

    res.status(200).render("city-list", {
        title: "Cities",
        cities
    });
});

exports.getAreaListView = catchAsync(async (req, res, next) => {

    const areas = await areaRepository.getAll();

    res.status(200).render("area-list", {
        title: "Areas",
        areas
    });
});