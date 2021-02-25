/* eslint-disable prettier/prettier */
const express = require('express');

const viewController = require('../controllers/view-controller');
const authController = require('../controllers/auth-controller');
// const authController = require('@expresso-app/expresso-auth');
const uploadController = require('../controllers/upload-controller');
const testController = require('../controllers/test-controller');
const tagController = require('../controllers/tag-controller');
const countryController = require('../controllers/country-controller');
const cityController = require('../controllers/city-controller');
const areaController = require('../controllers/area-controller');
const restaurantController = require('../controllers/restaurant-controller');
const menuController = require('../controllers/menu-controller');
const branchController = require('../controllers/branch-controller');
const categoryController = require('../controllers/category-controller');

const router = express.Router();

router.use(authController.isLoggedIn);

// ROUTES
router.get("/login", viewController.login);

router.get("/", authController.protect, viewController.getDashboardView);

router.get("/countries", countryController.getCountryListView);
router.get("/countries/:id", countryController.getCountryDetailView);
router.post("/countries", 
            uploadController.uploadImage, // uploadController.resizeImage,
            countryController.createOrUpdateCountry);
router.delete("/countries/:id", countryController.deleteCountry);

router.get("/cities", cityController.getCityListView);
router.get("/cities/:id", cityController.getCityDetailView);
router.post("/cities", cityController.createOrUpdateCity);
router.delete("/cities/:id", cityController.deleteCity);

router.get("/areas", areaController.getAreaListView);
router.get("/areas/:id", areaController.getAreaDetailView);
router.post("/areas", areaController.createOrUpdateArea);
router.delete("/areas/:id", areaController.deleteArea);

router.get("/tags", tagController.getTagListView);
router.get("/tags/:id", tagController.getTagDetailView);
router.post("/tags", tagController.createOrUpdateTag);
router.delete("/tags/:id", tagController.deleteTag);

router.get("/categories", categoryController.getCategoryListView);
router.get("/categories/:id", categoryController.getCategoryDetailView);
router.post("/categories", categoryController.createOrUpdateCategory);
router.delete("/categories/:id", categoryController.deleteCategory);

router.get("/restaurants", restaurantController.getRestaurantList);
router.get("/restaurants/:id", restaurantController.getRestaurantDetailView);
router.post("/restaurants", uploadController.uploadImage,
                            restaurantController.createOrUpdateRestaurant);
router.delete("/restaurants/:id", restaurantController.deleteRestaurant);

router.get("/restaurants/:id/menu", menuController.getRestaurantMenuView);
router.post("/menuSections", menuController.createOrUpdateMenuSection);
router.get("/menusections/:sectionId/items/:id", menuController.getMenuItemView);
router.post("/menuItems", uploadController.uploadImage, menuController.createOrUpdateMenuItem);
router.get("/menuItems/:menuItemId/menuItemOptions/:id", menuController.getMenuItemOption);
router.post("/menuItemsOptions", menuController.createOrUpdateMenuItemOption);
router.post("/menuItemsOptionsItems", menuController.createOrUpdateMenuItemOptionItem);

router.get("/branches", branchController.getBranchList);
router.get("/branches/:id", branchController.getBranchDetailView);
router.post("/branches", branchController.createOrUpdateBranch);
router.delete("/branches/:id", branchController.deleteBranch);

router.get("/me", authController.protect, viewController.getAccount);
// router.post("/account-data", authController.protect, viewController.updateAccountData); // HTML FORM

router.get("/config", viewController.getConfig);

router.get("/test", authController.protect, testController.test);
router.get("/checkout/:orderId", authController.protect, viewController.checkout);
router.get("/chat", viewController.chat);

module.exports = router;
