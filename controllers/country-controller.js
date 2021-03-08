/* eslint-disable prettier/prettier */
const { catchAsync, errorHandling } = require('expresso-utils');
const AppError = errorHandling.AppError;
const { countryRepository } = require("expresso-repositories");

const imageHandler = require('../utils/image');


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

    if (req.files[0]) {
        const fileName = req.files[0].filename;

        // console.log(imageHandler.folderName);

        /// encode image to base64
        data.image = await imageHandler.saveImageAsBase64(fileName);
        
        /// delete image from uploads folder
        imageHandler.deleteImage(fileName);
    }

    
    if (id === "0") {
        const newCountry = await countryRepository.create(data);

        res.redirect("/countries");
    } else {
        const updatedCountry = await countryRepository.update(id, data);

        res.redirect(`/countries/${id}`);
    }
});

exports.deleteCountry = catchAsync(async (req, res, next) => {
    await countryRepository.delete(req.params.id);
});