/* eslint-disable prettier/prettier */
const { catchAsync, errorHandling } = require('expresso-utils');
const AppError = errorHandling.AppError;
const { restaurantRepository, menuRepository, menuSectionRepository } = require("expresso-repositories");

exports.getRestaurantMenuView = catchAsync(async (req, res, next) => {
    const restaurantId = req.params.id;
    const restaurant = await restaurantRepository.getById(restaurantId);

    if(!restaurant) return next(new AppError("Restaurant not found!", 404));

    const menu = await menuRepository.getByRestaurantId(restaurantId);

    if(menu.menuSections.length > 0) {
        const menuSectionPromises = menu.menuSections.map(async sectionId => { return await menuSectionRepository.getById(sectionId) });
        menu.menuSections = await Promise.all(menuSectionPromises);
    }
    
    res.status(200).render("restaurant-menu", {
        title: `${restaurant.name} Menu`,
        menu
    });
});

exports.createOrUpdateMenuSection = catchAsync(async (req, res, next) => {
    const menuId = req.body.id;

    const menu = await menuRepository.getById(menuId);

    const newMenuSection = await menuSectionRepository.create({
        menu: menu._id,
        name: req.body.name
    });

    menu.menuSections.push(newMenuSection.id);

    await menuRepository.update(menuId, {
        menuSections: menu.menuSections
    });

    res.redirect(`/restaurants/${menu.restaurant.id}/menu`);
});
