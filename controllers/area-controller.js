/* eslint-disable prettier/prettier */
const { catchAsync, errorHandling } = require('expresso-utils');
const AppError = errorHandling.AppError;
const { countryRepository, cityRepository, areaRepository } = require("expresso-repositories");

exports.getAreaListView = catchAsync(async (req, res, next) => {

    const areas = await areaRepository.getAll();

    res.status(200).render("area-list", {
        title: "Areas",
        areas
    });
});

exports.getAreaDetailView = catchAsync(async (req, res, next) => {

    const countryList = (await countryRepository.getAll())
        .map(country => { return { id: country.id, name: country.name } });
    const cityList = (await cityRepository.getAll())
        .map(city => { return { id: city.id, name: city.name, country: city.country} });

    if (req.params.id === "new") {
        const emptyArea = {
            id: 0,
            name: "",
            city: {
                name: "",
                country: {
                    name: ""
                }
            }
        };

        res.status(200).render("area-detail", {
            title: "New",
            countryList,
            cityList,
            area: emptyArea
        });
    } else {
        const area = await areaRepository.getById(req.params.id);

        if (!area) {
            return next(new AppError("There is no area with that id!", 404));
        }

        res.status(200).render("area-detail", {
            title: area.name,
            countryList,
            cityList,
            area
        });
    }
});

exports.createOrUpdateArea = catchAsync(async (req, res, next) => {
    const id = req.body.id;

    if (id === "0") {
        const newArea = await areaRepository.create({
            name: req.body.name,
            city: req.body.city 
        });

        res.redirect(`/areas/`);
    } else {
        const updatedArea = await areaRepository.update(id, {
            name: req.body.name,
            city: req.body.city
        });

        res.redirect(`/areas/${updatedArea.id}`);
    }
});

exports.deleteArea = catchAsync(async (req, res, next) => {
    await areaRepository.delete(req.params.id);

    // res.redirect(`/areas/`);
});