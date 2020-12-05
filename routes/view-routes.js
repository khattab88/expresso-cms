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
router.get("/areas/:id", viewController.getAreaDetailView);

router.get("/tags", viewController.getTagListView);
router.get("/tags/:id", viewController.getTagDetailView);

router.get("/restaurants", viewController.getRestaurantList);
router.get("/restaurants/:id", viewController.getRestaurantDetailView);

router.get("/branches", viewController.getBranchList);
router.get("/branches/:id", viewController.getBranchDetailView);

router.get("/admins", viewController.getAdminList);

module.exports = router;
