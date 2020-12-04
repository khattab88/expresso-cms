/* eslint-disable prettier/prettier */
const { catchAsync } = require('expresso-utils');
const { Tag, Country, City, Area, Restaurant, Branch } = require('expresso-models');
const { tagRepository, countryRepository, cityRepository, areaRepository, restaurantRepository, branchRepository } = require("expresso-repositories");

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

exports.getCountryDetailView = catchAsync(async (req, res, next) => {

    const country = await countryRepository.getById(req.params.id);

    res.status(200).render("country-detail", {
        title: country.name,
        country
    });
});

exports.getCityListView = catchAsync(async (req, res, next) => {

    const cities = await cityRepository.getAll();

    res.status(200).render("city-list", {
        title: "Cities",
        cities
    });
});

exports.getCityDetailView = catchAsync(async (req, res, next) => {

    const city = await cityRepository.getById(req.params.id);

    res.status(200).render("city-detail", {
        title: city.name,
        city
    });
});

exports.getAreaListView = catchAsync(async (req, res, next) => {

    const areas = await areaRepository.getAll();

    res.status(200).render("area-list", {
        title: "Areas",
        areas
    });
});

exports.getAreaDetailView = catchAsync(async (req, res, next) => {

    const area = await areaRepository.getById(req.params.id);

    res.status(200).render("area-detail", {
        title: area.name,
        area
    });
});

exports.getRestaurantList = catchAsync(async (req, res, next) => {

    const restaurants = await restaurantRepository.getAll();

    res.status(200).render("restaurant-list", {
        title: "Restaurants",
        restaurants
    });
});

exports.getBranchList = catchAsync(async (req, res, next) => {

    const branches = await branchRepository.getAll();

    res.status(200).render("branch-list", {
        title: "Branches",
        branches
    });
});

exports.getAdminList = catchAsync(async (req, res, next) => {

    const admins = [];

    res.status(200).render("admin-list", {
        title: "Admins",
        admins
    });
});