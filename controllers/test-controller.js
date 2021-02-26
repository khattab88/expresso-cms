const { errorHandling, catchAsync, helpers } = require("expresso-utils");
const AppError = errorHandling.AppError;
const Email = require("../utils/email");

const path = require("path");
const imageToBase64 = require('image-to-base64');
const fs = require('fs');

const imageHandler = require("../utils/image");

exports.test = catchAsync(async (req, res, next) => {
    /// send WELCOME email
    // const url = `${req.protocol}://${req.get("host")}/login`;
    // await new Email(req.user, url).sendWelcome();

    /// send PASSWORD RESET email
    // const url = `${req.protocol}://${req.get("host")}/login`;
    // await new Email(req.user, "#").sendPasswordReset();

    // res.send(req.originalUrl);

    const appUrl = `${req.protocol}://${req.get("host")}`;
    // console.log(appUrl);

    let fileName = "1614284211786.png";
    // fileName = "1613938396169.jpeg";
    
    // const imgDataUrl = await imageHandler.saveImageAsBase64(fileName);

    // const dir = await imageHandler.deleteImage("1614284211786.png");

    /// DELETE ALL IMAGES (in uploads folder)
    //imageHandler.deleteAllImages();

    res.status(200).render("test", {
        // imgDataUrl
    });
});