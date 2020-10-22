/* eslint-disable prettier/prettier */
const express = require('express');
const viewController = require('../controllers/view-controller');

const router = express.Router();

// ROUTES
router.get("/", viewController.getDashboardView);

router.get("/countries", viewController.getCountryListView);
router.get("/cities", viewController.getCityListView);
router.get("/areas", viewController.getAreaListView);

router.get("/tags", viewController.getTagListView);
router.get("/restaurants", viewController.getRestaurantList);

module.exports = router;
