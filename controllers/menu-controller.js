/* eslint-disable prettier/prettier */
const { catchAsync, errorHandling } = require('expresso-utils');
const AppError = errorHandling.AppError;
const { restaurantRepository, menuRepository, menuSectionRepository,
        menuItemRepository, menuItemOptionRepository, menuItemOptionItemRepository } = require("expresso-repositories");

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
            options: [],
            menuSectionId: menuSection._id.toString(),
        };

        res.status(200).render("menu-item", {
            title: `${menuSection.name} / New Menu Item`,
            menuItem: emptyMenuItem
        });
    } else {
        const menuItem = await menuItemRepository.getById(menuItemId);

        // populate menu item with options
        const optionPromises = menuItem.options.map(async optionId => { 
            return await menuItemOptionRepository.getById(optionId)
        });
        menuItem.options = await Promise.all(optionPromises);

        res.status(200).render("menu-item", {
            title: `${menuSection.name} / ${menuItem.name}`,
            menuItem,
            menuSectionId: menuSectionId
        });
    }
});

exports.createOrUpdateMenuItem = catchAsync(async (req, res, next) => {
    const menuSectionId = req.body.menusectionId;
    const menuItemId = req.body.id;

    const menuSection = await menuSectionRepository.model.findOne({ _id: menuSectionId });

    const data = {
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        menuSection: menuSection._id.toString()
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
        const updatedMenuItem = await menuItemRepository.update(menuItemId, data);

        res.redirect(`/restaurants/${menuSection.menu.restaurant.id}/menu`);
    }
});

exports.getMenuItemOption = catchAsync(async (req, res, next) => {
    const menuItemId = req.params.menuItemId;
    const id = req.params.id;

    if(id === "new") {
        const emptyMenuItemOption = {
            id: 0,
            name: "",
            type: "Optional",
            options: []
        };

        res.render("menu-item-option", {
            title: "Edit Menu Item Option",
            menuItemOption: emptyMenuItemOption,
            menuItemId
        });
    } else {
        const menuItemOption = await menuItemOptionRepository.getById(id);

        // populate option items
        const itemOptionPromises = menuItemOption.optionItems.map(async optionItemId => {
            return await menuItemOptionItemRepository.getById(optionItemId);
        });
        menuItemOption.optionItems = await Promise.all(itemOptionPromises);

        res.render("menu-item-option", {
            title: "Edit Menu Item Option",
            menuItemOption: menuItemOption,
            menuItemId
        });
    }
});

exports.createOrUpdateMenuItemOption = catchAsync(async (req, res, next) => {
    const menuItemId = req.body.menuItemId;
    const menuItem = await menuItemRepository.getById(menuItemId);

    const data = {
        name: req.body.name,
        type: req.body.type,
        menuItem: menuItem._id
    };

    const id = req.body.id;
    let option = null;

    if(id === "0") {  
        option = await menuItemOptionRepository.create(data);

        menuItem.options.push(option.id);
        await menuItemRepository.update(menuItem.id, {
            options: menuItem.options
        });
    } else {
        option = await menuItemOptionRepository.update(id, data);
    }

    res.redirect(`/menuItems/${menuItemId}/menuItemOptions/${option.id}`);
});

exports.createOrUpdateMenuItemOptionItem = catchAsync(async (req, res, next) => {
    const { optionId ,name, value } = req.body;

    const option = await menuItemOptionRepository.getById(optionId);

    const optionItem = await menuItemOptionItemRepository.create({
        name,
        value,
        option: option._id
    });

    option.optionItems.push(optionItem.id);
    await menuItemOptionRepository.update(option.id, {
        optionItems: option.optionItems
    });

    res.status(200).send({
        status: "success",
        data: {
            optionItem
        }
    });
});