/* eslint-disable prettier/prettier */
const { catchAsync, errorHandling } = require('expresso-utils');
const { countryRepository, cityRepository, areaRepository,
        tagRepository, restaurantRepository, branchRepository,
        userRepository } = require("expresso-repositories");
const AppError = errorHandling.AppError;
const config = require("../config");

/* Dashboard */
exports.getDashboardView = catchAsync(async (req, res, next) => {
    res.status(200).render("dashboard", {
        title: "Dashboard"
    });
});

/* Config */
exports.getConfig = catchAsync(async (req, res, next) => {
    res.status(200).json({
        env: config.env,
        apiUrl: config.apiUrl
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

/* Chat (ONLY FOR TESTING) */
exports.chat = catchAsync(async (req, res, next) => {
    res.status(200).render("chat", {
        title: "Chat"
    });
});