/* eslint-disable prettier/prettier */
const { catchAsync, errorHandling } = require('expresso-utils');
const AppError = errorHandling.AppError;
const { restaurantRepository, menuRepository } = require("expresso-repositories");


exports.getRestaurantList = catchAsync(async (req, res, next) => {

    const restaurants = await restaurantRepository.getAll();

    res.status(200).render("restaurant-list", {
        title: "Restaurants",
        restaurants
    });
});

exports.getRestaurantDetailView = catchAsync(async (req, res, next) => {
    if (req.params.id === "new") {
        const emptyRestaurant = {
            id: 0,
            name: "",
            slogan: "",
            deliveryTime: 0,
            deliveryFee: 0,
            specialOffers: false
        };

        res.status(200).render("restaurant-detail", {
            title: "New",
            restaurant: emptyRestaurant
        });
    } else {
        const restaurant = await restaurantRepository.getById(req.params.id);

        if (!restaurant) {
            return next(new AppError("There is no restaurant with that id!", 404));
        }

        res.status(200).render("restaurant-detail", {
            title: restaurant.name,
            restaurant
        });
    }
});

exports.createOrUpdateRestaurant = catchAsync(async (req, res, next) => {
    const id = req.body.id;

    if (id === "0") {
        const newRestaurant = await restaurantRepository.create({
            name: req.body.name,
            slogan: req.body.slogan,
            deliveryTime: req.body.deliveryTime,
            deliveryFee: req.body.deliveryFee,
            specialOffers: req.body.specialOffers === "on" ?true :false
        });

        const newMenu = await menuRepository.create({
            restaurant: newRestaurant._id
        });

        res.redirect(`/restaurants`);
    } else {
        const updatedRestaurant = await restaurantRepository.update(id, {
            name: req.body.name,
            slogan: req.body.slogan,
            deliveryTime: req.body.deliveryTime,
            deliveryFee: req.body.deliveryFee,
            specialOffers: req.body.specialOffers === "on" ?true :false
        });

        res.redirect(`/restaurants/${id}`);
    }
});

exports.deleteRestaurant = catchAsync(async (req, res, next) => {
    await restaurantRepository.delete(req.params.id);

    // res.redirect(`/restaurants/`);
});