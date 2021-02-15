/* eslint-disable prettier/prettier */
const { catchAsync, errorHandling } = require('expresso-utils');
const AppError = errorHandling.AppError;
const { branchRepository, restaurantRepository, areaRepository } = require("expresso-repositories");

exports.getBranchList = catchAsync(async (req, res, next) => {
    let branches = await branchRepository.getAll();

    if (req.query.restaurantId) {
        const restaurant = await restaurantRepository.getById(req.query.restaurantId);

        branches = branches.filter(branch => branch.restaurant._id.toString() == restaurant._id.toString());
    }

    res.status(200).render("branch-list", {
        title: "Branches",
        branches
    });
});

exports.getBranchDetailView = catchAsync(async (req, res, next) => {
    const restaurantList = Array.from(await restaurantRepository.getAll()).map(restaurant => {
        return {
            _id: restaurant._id,
            id: restaurant.id,
            name: restaurant.name
        }
    });

    const areaList = Array.from(await areaRepository.getAll()).map(area => {
        return {
            _id: area._id,
            id: area.id,
            name: area.name
        }
    });


    let branch = null;
    if (req.params.id == "new") {
        branch = {
            id: 0,
            name: "",
            restaurant: "",
            area: "",
            location: { coordinates: [31.200208,30.041311] }
        };
    } else {
        branch = await branchRepository.getById(req.params.id);

        if (!branch) return next(new AppError("There is no branch with that id!", 404));
    }

    res.status(200).render("branch-detail", {
        title: branch.name,
        restaurantList,
        areaList,
        branch
    });
});

exports.createOrUpdateBranch = catchAsync(async (req, res, next) => {
    const id = req.body.id;

    const data = {
        name: req.body.name,
        restaurant: req.body.restaurant,
        area: req.body.area,
        location: {
            coordinates: req.body.coordinates.split(",")
        }
    };

    if(id === "0") {
        await branchRepository.create(data);
    } else {
        await branchRepository.update(id, data);
    }

    res.redirect("/branches");
});

exports.deleteBranch = catchAsync(async (req, res, next) => {
    await branchRepository.delete(req.params.id);
});