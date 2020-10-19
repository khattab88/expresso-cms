/* eslint-disable prettier/prettier */
const express = require('express');
const viewController = require('../controllers/view-controller');

const router = express.Router();

router.get("/", viewController.getDashboardView);
router.get("/tags", viewController.getTagListView);
router.get("/countries", viewController.getCountryListView);

module.exports = router;
