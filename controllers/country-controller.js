/* eslint-disable prettier/prettier */
const { catchAsync, errorHandling } = require('expresso-utils');
const AppError = errorHandling.AppError;
const { countryRepository } = require("expresso-repositories");

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

    const data = {
        name: req.body.name,
        alias: req.body.alias,
        currency: req.body.currency
    };

    if (req.file) {
        data.image = req.file.filename;
    }

    const updatedCountry = await countryRepository.update(req.body.id, data);

    res.redirect(`/countries/${req.body.id}`);
});
