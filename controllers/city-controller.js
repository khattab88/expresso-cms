/* eslint-disable prettier/prettier */
const { catchAsync, errorHandling } = require('expresso-utils');
const AppError = errorHandling.AppError;
const { countryRepository, cityRepository } = require("expresso-repositories");

exports.getCityListView = catchAsync(async (req, res, next) => {

    const cities = await cityRepository.getAll();

    res.status(200).render("city-list", {
        title: "Cities",
        cities
    });
});

exports.getCityDetailView = catchAsync(async (req, res, next) => {
    const countryList = (await countryRepository.getAll())
                         .map(country => { return { id: country.id, name: country.name} });

    if (req.params.id === "new") {
        const emptyCity = {
            id: 0,
            name: "",
            country: {
                name: ""
            }
        };

        res.status(200).render("city-detail", {
            title: "New",
            countryList,
            city: emptyCity
        });
    } else {
        const city = await cityRepository.getById(req.params.id);

        if (!city) {
            return next(new AppError("There is no city with that id!", 404));
        }

        res.status(200).render("city-detail", {
            title: city.name,
            countryList,
            city
        });
    }
});

exports.createOrUpdateCity = catchAsync(async (req, res, next) => {
    const id = req.body.id;

    if (id === "0") {
        const newCity = await cityRepository.create({
            name: req.body.name,
            country: req.body.country 
        });

        res.redirect(`/cities/`);
    } else {
        const updatedCity = await cityRepository.update(id, {
            name: req.body.name,
            country: req.body.country
        });

        res.redirect(`/cities/${updatedCity.id}`);
    }
});

exports.deleteCity = catchAsync(async (req, res, next) => {
    await cityRepository.delete(req.params.id);

    // res.redirect(`/cities/`);
});
