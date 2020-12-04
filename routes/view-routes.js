/* eslint-disable prettier/prettier */
const express = require('express');
const viewController = require('../controllers/view-controller');

const router = express.Router();

// ROUTES
router.get("/", viewController.getDashboardView);

router.get("/countries", viewController.getCountryListView);
router.get("/countries/:id", viewController.getCountryDetailView);

router.get("/cities", viewController.getCityListView);
router.get("/cities/:id", viewController.getCityDetailView);

router.get("/areas", viewController.getAreaListView);

router.get("/tags", viewController.getTagListView);
router.get("/restaurants", viewController.getRestaurantList);
router.get("/branches", viewController.getBranchList);

router.get("/admins", viewController.getAdminList);

module.exports = router;
