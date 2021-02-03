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
    if (req.params.id === "new") {
        const emptyCountry = {
            id: 0,
            name: "",
            alias: "",
            currency: "",
        };

        res.status(200).render("country-detail", {
            title: "New",
            country: emptyCountry
        });
    } else {
        const country = await countryRepository.getById(req.params.id);

        if (!country) {
            return next(new AppError("There is no country with that id!", 404));
        }

        res.status(200).render("country-detail", {
            title: country.name,
            country
        });
    }
});

exports.createOrUpdateCountry = catchAsync(async (req, res, next) => {
    const id = req.body.id;

    const data = {
        name: req.body.name,
        alias: req.body.alias,
        currency: req.body.currency
    };

    if (req.file) {
        data.image = req.file.filename;
    }

    if (id === "0") {
        const newCountry = await countryRepository.create(data);

        res.redirect("/countries");
    } else {
        const updatedCountry = await countryRepository.update(id, data);

        res.redirect(`/countries/${id}`);
    }
});
