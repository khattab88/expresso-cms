/* eslint-disable prettier/prettier */
const { catchAsync, errorHandling } = require('expresso-utils');
const AppError = errorHandling.AppError;
const { categoryRepository, restaurantRepository, menuRepository } = require("expresso-repositories");

const imageHandler = require('../utils/image');


exports.getRestaurantList = catchAsync(async (req, res, next) => {

    const restaurants = await restaurantRepository.getAll();

    res.status(200).render("restaurant-list", {
        title: "Restaurants",
        restaurants
    });
});

exports.getRestaurantDetailView = catchAsync(async (req, res, next) => {
    const categoryList = (await categoryRepository.getAll())
        .map(category => {
            return {
                id: category.id,
                _id: category._id,
                name: category.name
            };
        });

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
            categoryList,
            restaurant: emptyRestaurant
        });
    } else {
        const restaurant = await restaurantRepository.getById(req.params.id);

        if (!restaurant) {
            return next(new AppError("There is no restaurant with that id!", 404));
        }

        res.status(200).render("restaurant-detail", {
            title: restaurant.name,
            categoryList,
            restaurant
        });
    }
});

exports.createOrUpdateRestaurant = catchAsync(async (req, res, next) => {
    const id = req.body.id;

    const data = {
        name: req.body.name,
        slogan: req.body.slogan,
        deliveryTime: req.body.deliveryTime,
        deliveryFee: req.body.deliveryFee,
        specialOffers: req.body.specialOffers === "on" ? true : false,
        category: req.body.category
    };

    if (req.files) {
        for (let i = 0; i < req.files.length; i++) {
            const file = req.files[i];
             
            //encode image to base64
            data[file.fieldname] = await imageHandler.saveImageAsBase64(file.filename);

            // delete image from uploads folder
            imageHandler.deleteImage(file.filename);
        }
    }

    if (id === "0") {
        const newRestaurant = await restaurantRepository.create(data);

        const newMenu = await menuRepository.create({
            restaurant: newRestaurant._id
        });

        res.redirect(`/restaurants`);
    } else {
        const updatedRestaurant = await restaurantRepository.update(id, data);

        res.redirect(`/restaurants/${id}`);
    }
});

exports.deleteRestaurant = catchAsync(async (req, res, next) => {
    await restaurantRepository.delete(req.params.id);

    // res.redirect(`/restaurants/`);
});