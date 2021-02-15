/* eslint-disable prettier/prettier */
const { catchAsync, errorHandling } = require('expresso-utils');
const AppError = errorHandling.AppError;
const { branchRepository, restaurantRepository, areaRepository } = require("expresso-repositories");

exports.getBranchList = catchAsync(async (req, res, next) => {
    let branches =  await branchRepository.getAll();

    if(req.query.restaurantId !== null) {
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
            id: restaurant.id,
            name: restaurant.name 
        }
    });

    const areaList = Array.from(await areaRepository.getAll()).map(area => {
        return {
            id: area.id,
            name: area.name
        }
    });

    const branch = await branchRepository.getById(req.params.id);

    if (!branch) {
        return next(new AppError("There is no branch with that id!", 404));
    }

    res.status(200).render("branch-detail", {
        title: branch.name,
        restaurantList,
        areaList,
        branch
    });
});

