/* eslint-disable prettier/prettier */
const { catchAsync, errorHandling } = require('expresso-utils');
const AppError = errorHandling.AppError;
const { restaurantRepository, menuRepository, menuSectionRepository, menuItemRepository } = require("expresso-repositories");

exports.getRestaurantMenuView = catchAsync(async (req, res, next) => {
    const restaurantId = req.params.id;
    const restaurant = await restaurantRepository.getById(restaurantId);

    if (!restaurant) return next(new AppError("Restaurant not found!", 404));

    const menu = await menuRepository.getByRestaurantId(restaurantId);

    // populate menu sections
    if (menu.menuSections.length > 0) {
        const menuSectionPromises = menu.menuSections.map(async sectionId => { return await menuSectionRepository.getById(sectionId) });
        menu.menuSections = await Promise.all(menuSectionPromises);
    }

    // populate menu items for each section
    for (const section of menu.menuSections) {
        const menuItemPromises = section.menuItems.map(async menuItemId => {
            return await menuItemRepository.getById(menuItemId);
        });

        section.menuItems = await Promise.all(menuItemPromises);
    }

    res.status(200).render("restaurant-menu", {
        title: `${restaurant.name} Menu`,
        menu
    });
});

exports.createOrUpdateMenuSection = catchAsync(async (req, res, next) => {
    const menuId = req.body.menuId;

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

exports.getMenuItemView = catchAsync(async (req, res, next) => {
    const menuSectionId = req.params.sectionId;
    const menuItemId = req.params.id;

    const menuSection = await menuSectionRepository.getById(menuSectionId);

    if (menuItemId === "new") {

        const emptyMenuItem = {
            id: 0,
            name: "",
            price: 0,
            description: "",
            image: "item-0.jpg",
            // options: [],
            options: [
                {
                    id: "ddjdjdj",
                    name: "bread type",
                    type: "Required",
                    optionItems: [
                        { id: "jdjdj", name: "thick", value: 10 },
                        { id: "jdjdj", name: "slim", value: 15 }
                    ]
                },
                {
                    id: "jfjfjfs",
                    name: "extra cheese",
                    type: "Optional",
                    optionItems: [
                        { id: "jdjdj", name: "yes", value: 10 },
                        { id: "jdjdj", name: "no", value: 0 }
                    ]
                }
            ],
            menuSectionId: menuSectionId
        };

        res.status(200).render("menu-item", {
            title: `${menuSection.name} / New Menu Item`,
            menuItem: emptyMenuItem
        });
    } else {
        const menuItem = await menuItemRepository.getById(menuItemId);

        res.status(200).render("menu-item", {
            title: `${menuSection.name} / ${menuItem.name}`,
            menuItem
        });
    }
});

exports.createOrUpdateMenuItem = catchAsync(async (req, res, next) => {
    const menuSectionId = req.body.menusectionId;
    const menuItemId = req.body.id;

    const menuSection = await menuSectionRepository.getById(menuSectionId);

    const data = {
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        menuSection: menuSection._id
    };

    if (req.file) {
        data.image = req.file.filename;
    }

    if (menuItemId === "0") {
        const newMenuItem = await menuItemRepository.create(data);

        menuSection.menuItems.push(newMenuItem.id);

        await menuSectionRepository.update(menuSection.id, {
            menuItems: menuSection.menuItems
        });

        res.redirect(`/restaurants/${menuSection.menu.restaurant.id}/menu`);
    } else {
        //TODO: upadte existing menu item
    }
});