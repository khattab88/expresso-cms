/* eslint-disable prettier/prettier */
/* eslint-disable import/newline-after-import */
/* eslint-disable prettier/prettier */
const express = require('express');
const router = express.Router();

// const auth = require('@expresso-app/expresso-auth');
const auth = require('../controllers/auth-controller');
// const userController = require('../controllers/user-controller');

router
    .route("/signup")
    .post(auth.signup);

router
    .route("/login")
    .post(auth.login);

    router
    .route("/loginadmin")
    .post(auth.loginAdmin);

router
    .route("/logout")
    .get(auth.logout);

router
    .route("/forgotPassword")
    .post(auth.forgotPassword);

router
    .route("/resetPassword/:token")
    .patch(auth.resetPassword);


// Protected Routes
router.use(auth.protect);

router
    .route("/changePassword")
    .patch(auth.changePassword);

// router
//     .route("/me")
//     .get(auth.getMe, userController.getUser);

router
    .route("/updateMe")
    .patch(auth.updateMe);

router
    .route("/deactivate")
    .delete(auth.deactivate);

module.exports = router;