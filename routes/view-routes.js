/* eslint-disable prettier/prettier */
const express = require('express');

const viewController = require('../controllers/view-controller');
const authController = require('../controllers/auth-controller');
const uploadController = require('../controllers/upload-controller');

const router = express.Router();

router.use(authController.isLoggedIn);

// ROUTES
router.get("/login", viewController.login);

router.get("/", authController.protect, viewController.getDashboardView);

router.get("/countries", viewController.getCountryListView);
router.get("/countries/:id", viewController.getCountryDetailView);
router.post("/countries/update", uploadController.uploadImage, viewController.updateCountry)

router.get("/cities", viewController.getCityListView);
router.get("/cities/:id", viewController.getCityDetailView);

router.get("/areas", viewController.getAreaListView);
router.get("/areas/:id", viewController.getAreaDetailView);

router.get("/tags", viewController.getTagListView);
router.get("/tags/:id", viewController.getTagDetailView);
router.post("/tags/update", viewController.updateTag);

router.get("/restaurants", viewController.getRestaurantList);
router.get("/restaurants/:id", viewController.getRestaurantDetailView);
router.get("/restaurants/:id/menu", viewController.getRestaurantMenuView);

router.get("/branches", viewController.getBranchList);
router.get("/branches/:id", viewController.getBranchDetailView);

router.get("/me", authController.protect, viewController.getAccount);
// router.post("/account-data", authController.protect, viewController.updateAccountData); // HTML FORM

module.exports = router;
