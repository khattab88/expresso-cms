/* eslint-disable prettier/prettier */
const { catchAsync } = require('expresso-utils');
const { Tag, Country, City, Area, Restaurant, Branch } = require('expresso-models');
const { tagRepository, countryRepository, cityRepository, areaRepository, restaurantRepository, branchRepository } = require("expresso-repositories");

/* Dashboard */
exports.getDashboardView = catchAsync(async (req, res, next) => {
    res.status(200).render("dashboard", {
        title: "Dashboard"
    });
});


/* Countries */
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


/* Cities */
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


/* Areas */
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


/* Tags */
exports.getTagListView = catchAsync(async (req, res) => {

    const tags = await tagRepository.getAll();

    res.status(200).render("tag-list", {
        title: "Tags",
        tags
    });
});

exports.getTagDetailView = catchAsync(async (req, res, next) => {

    const tag = await tagRepository.getById(req.params.id);

    res.status(200).render("tag-detail", {
        title: tag.name,
        tag
    });
});


/* Restaurants */
exports.getRestaurantList = catchAsync(async (req, res, next) => {

    const restaurants = await restaurantRepository.getAll();

    res.status(200).render("restaurant-list", {
        title: "Restaurants",
        restaurants
    });
});

exports.getRestaurantDetailView = catchAsync(async (req, res, next) => {

    const restaurant = await restaurantRepository.getById(req.params.id);

    res.status(200).render("restaurant-detail", {
        title: restaurant.name,
        restaurant
    });
});

exports.getRestaurantMenuView = catchAsync(async (req, res, next) => {

    const restaurant = await restaurantRepository.getById(req.params.id);

    res.status(200).render("restaurant-menu", {
        title: `${restaurant.name} Menu`,
        restaurant
    });
});

/* Branches */
exports.getBranchList = catchAsync(async (req, res, next) => {

    const branches = await branchRepository.getAll();

    res.status(200).render("branch-list", {
        title: "Branches",
        branches
    });
});

exports.getBranchDetailView = catchAsync(async (req, res, next) => {

    const branch = await branchRepository.getById(req.params.id);

    res.status(200).render("branch-detail", {
        title: branch.name,
        branch
    });
});


/* Admins */
exports.getAdminList = catchAsync(async (req, res, next) => {

    const admins = [];

    res.status(200).render("admin-list", {
        title: "Admins",
        admins
    });
});


/* Login */
exports.login = catchAsync(async (req, res, next) => {
    res.status(200).render("login", {
        title: "Login",
    });
});