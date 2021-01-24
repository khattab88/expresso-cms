/* eslint-disable prettier/prettier */
const { catchAsync, errorHandling } = require('expresso-utils');
const { Tag, Country, City, Area, Restaurant, Branch } = require('expresso-models');
const { countryRepository, cityRepository, areaRepository,
        tagRepository, restaurantRepository, branchRepository,
        userRepository } = require("expresso-repositories");
const AppError = errorHandling.AppError;


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

    if (!country) {
        return next(new AppError("There is no country with that id!", 404));
    }

    res.status(200).render("country-detail", {
        title: country.name,
        country
    });
});

exports.updateCountry = catchAsync(async (req, res, next) => {
    // console.log(req.body);
    // console.log(req.file);

    const data = {
        name: req.body.name,
        alias: req.body.alias,
        currency: req.body.currency
    };

    if(req.file) {
        data.image = req.file.filename;
    }

    const updatedCountry = await countryRepository.update(req.body.id, data);

    res.redirect(`/countries/${req.body.id}`);
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

    if (!city) {
        return next(new AppError("There is no city with that id!", 404));
    }

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

    if (!area) {
        return next(new AppError("There is no area with that id!", 404));
    }

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

    if (!tag) {
        return next(new AppError("There is no tag with that id!", 404));
    }

    res.status(200).render("tag-detail", {
        title: tag.name,
        tag
    });
});

exports.updateTag = catchAsync(async (req, res, next) => {
    const updatedTag = await tagRepository.update(req.body.id, {
        name: req.body.name
    });

    res.redirect(`/tags/${updatedTag.id}`);
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

    if (!restaurant) {
        return next(new AppError("There is no restaurant with that id!", 404));
    }

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

    if (!branch) {
        return next(new AppError("There is no branch with that id!", 404));
    }

    res.status(200).render("branch-detail", {
        title: branch.name,
        branch
    });
});


/* Login */
exports.login = catchAsync(async (req, res, next) => {
    res.status(200).render("login", {
        title: "Login",
    });
});


/* Account */
exports.getAccount = catchAsync(async (req, res, next) => {
    res.status(200).render("account", {
        title: "My Account",
    });
});

exports.updateAccountData = catchAsync(async (req, res, next) => {
    const updatedUser = await userRepository.update(req.user.id, {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email
    });

    res.status(200).render("account", {
        title: "My Account",
        user: updatedUser
    });
});


/* Checkout (ONLY FOR TESTING) */
exports.checkout = catchAsync(async (req, res, next) => {
    res.status(200).render("checkout", {
        title: "Checkout",
        orderId: req.params.orderId
    });
});