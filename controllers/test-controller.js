const { errorHandling, catchAsync, helpers } = require("expresso-utils");
const AppError = errorHandling.AppError;
const Email = require("../utils/email");


exports.test = catchAsync(async (req, res, next) => {
    const url = `${req.protocol}://${req.get("host")}/login`;
    await new Email(req.user, url).sendWelcome();

    res.send("yes");
});