/* eslint-disable prettier/prettier */
const express = require('express');

const viewController = require('../controllers/view-controller');
// const authController = require('../controllers/auth-controller');
const authController = require('@expresso-app/expresso-auth');
const uploadController = require('../controllers/upload-controller');
const testController = require('../controllers/test-controller');
const tagController = require('../controllers/tag-controller');
const countryController = require('../controllers/country-controller');
const cityController = require('../controllers/city-controller');
const areaController = require('../controllers/area-controller');
const restaurantController = require('../controllers/restaurant-controller');

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

router.get("/restaurants", restaurantController.getRestaurantList);
router.get("/restaurants/:id", restaurantController.getRestaurantDetailView);
router.post("/restaurants", restaurantController.createOrUpdateRestaurant);
router.delete("/restaurants/:id", restaurantController.deleteRestaurant);

router.get("/restaurants/:id/menu", viewController.getRestaurantMenuView);

router.get("/branches", viewController.getBranchList);
router.get("/branches/:id", viewController.getBranchDetailView);

router.get("/me", authController.protect, viewController.getAccount);
// router.post("/account-data", authController.protect, viewController.updateAccountData); // HTML FORM

router.get("/config", viewController.getConfig);

router.get("/test", authController.protect, testController.test);
router.get("/checkout/:orderId", authController.protect, viewController.checkout);
router.get("/chat", viewController.chat);

module.exports = router;
