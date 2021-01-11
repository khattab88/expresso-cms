const { errorHandling, catchAsync, helpers } = require("expresso-utils");
const AppError = errorHandling.AppError;
const Email = require("../utils/email");


exports.test = catchAsync(async (req, res, next) => {
    /// send WELCOME email
    // const url = `${req.protocol}://${req.get("host")}/login`;
    // await new Email(req.user, url).sendWelcome();

    /// send PASSWORD RESET email
    // const url = `${req.protocol}://${req.get("host")}/login`;
    await new Email(req.user, "#").sendPasswordReset();


    res.send("yes");
});