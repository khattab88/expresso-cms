/* eslint-disable prettier/prettier */
/* eslint-disable import/newline-after-import */
/* eslint-disable prettier/prettier */
const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth-controller');
// const userController = require('../controllers/user-controller');

router
    .route("/signup")
    .post(authController.signup);

router
    .route("/login")
    .post(authController.login);

    router
    .route("/loginadmin")
    .post(authController.loginAdmin);

router
    .route("/logout")
    .get(authController.logout);

router
    .route("/forgotPassword")
    .post(authController.forgotPassword);

router
    .route("/resetPassword/:token")
    .patch(authController.resetPassword);


// Protected Routes
router.use(authController.protect);

router
    .route("/changePassword")
    .patch(authController.changePassword);

// router
//     .route("/me")
//     .get(authController.getMe, userController.getUser);

router
    .route("/updateMe")
    .patch(authController.updateMe);

router
    .route("/deactivate")
    .delete(authController.deactivate);

module.exports = router;