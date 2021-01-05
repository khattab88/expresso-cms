/* eslint-disable prettier/prettier */
/* eslint-disable prefer-const */
/* eslint-disable node/no-unsupported-features/es-syntax */
/* eslint-disable prefer-destructuring */
/* eslint-disable prettier/prettier */
const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const { userRepository: userRepo } = require("expresso-repositories");
const { EmailService } = require("expresso-services");
const { errorHandling, catchAsync, helpers } = require("expresso-utils");
const AppError = errorHandling.AppError;


exports.protect = catchAsync(async (req, res, next) => {
    let token;

    // get token from authorization header
    if (
        req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt
    }

    if (!token) return next(new AppError("You are not logged in!", 401));

    // verify token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // check if user still exists
    const user = await userRepo.getById(decoded.id);
    if (!user) return next(new AppError("User is no longer exists", 401));

    // check if user changed password, after token issued
    if (user.hasPasswordChangedAfter(decoded.iat)) {
        return next(new AppError("User recently changed password, please login again!", 401));
    };

    // next() => grant access to protected route
    req.user = user;
    res.locals.loggedInUser = user;
    next();
});

// Only for rendered pages, no errors!
exports.isLoggedIn = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            // verify token
            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);

            // check if user still exists
            const user = await userRepo.getById(decoded.id);
            if (!user) return next();

            // check if user changed password, after token issued
            if (user.hasPasswordChangedAfter(decoded.iat)) {
                return next();
            };

            // there is a logged in user, add current user to res.locals
            // (make it accessible to pug templates)
            res.locals.loggedInUser = user;
            return next();

        } catch (err) {
            return next();
        }
    }

    next();
};

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        // Roles: ["user", "admin"]
        if (!roles.includes(req.user.role)) return next(new AppError("You don't have a sufficient permission!", 403));

        next();
    };
};


const signToken = id => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES
    });
};

const sendResponseWithCookie = (user, statusCode, res) => {
    const token = signToken(user.id);

    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    };
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    res.cookie('jwt', token, cookieOptions);

    // Remove password from output
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
};


exports.signup = catchAsync(async (req, res) => {
    // const newUser = await userRepo.create({
    //     firstName: req.body.firstName,
    //     lastName: req.body.lastName,
    //     email: req.body.email,
    //     password: req.body.password,
    //     passwordConfirm: req.body.passwordConfirm,
    //     passwordChangedAt: req.body.passwordChangedAt
    // });

    const newUser = await userRepo.create(req.body);

    sendResponseWithCookie(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) return next(new AppError("Please provide email and password!", 400));

    const user = await userRepo.getByEmail(email);
    if (!user) return next(new AppError("Email not found!", 404));

    const correctPassword = await user.isCorrectPassword(user.password, password);
    if (!correctPassword) return next(new AppError("Wrong password entered!", 401));

    sendResponseWithCookie(user, 200, res);
});

exports.loginAdmin = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) return next(new AppError("Please provide email and password!", 400));

    const admin = await userRepo.getAdminByEmail(email);
    if (!admin) return next(new AppError("Email not found!", 404));

    const correctPassword = await admin.isCorrectPassword(admin.password, password);
    if (!correctPassword) return next(new AppError("Wrong password entered!", 401));

    sendResponseWithCookie(admin, 200, res);
});

exports.logout = catchAsync(async (req, res, next) => {
    res.cookie("jwt", "loggedout", {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    res.status(200).json({
        status: 'success'
    });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
    // 1. get user based on posted Email
    const user = await userRepo.getByEmail(req.body.email);
    if (!user) return next(new AppError("There is no user with such email address!", 404));

    // 2. generate reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // 3. send generated token via email
    const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/auth/resetPassword/${resetToken}`;

    const message = `Forgot your password? Submit a PATCH request with your new password and password confirm to ${resetUrl}.
                    \nIf you did't forget your password, please ignore this email.`;

    const mailOptions = {
        email: user.email,
        subject: "Your password reset token (valid for 10 minutes)",
        message: message
    };

    try {
        const emailSvc = new EmailService(config.email_host, config.email_address, config.email_password);
        await emailSvc.sendEmail(mailOptions);

        res.status(200).json({
            status: 'success',
            message: 'Reset token sent to user email.'
        });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new AppError("Error occured while sending email to user, please try again later!", 500));
    }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
    // 1. get user based on reset token value
    const resetToken = req.params.token;
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    const user = await userRepo.getByFieldValue({ passwordResetToken: hashedToken });

    if (!user) {
        return next(new AppError("Invalid token!", 400));
    }

    if (user.passwordResetExpires < Date.now()) {
        return next(new AppError("Expired token!", 400));
    }

    // 2. if user exists && token is not expired => set the new password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.save();

    // 3. update passwordChangedAt property for user

    // 4. log user in, send JWT
    sendResponseWithCookie(user, 200, res);
});

exports.changePassword = catchAsync(async (req, res, next) => {
    // 1. get user
    const user = await userRepo.getById(req.user.id);
    //console.log(user);

    // 2. check if POSTed password is correct
    if (!user) return next(new AppError("User not found!", 404));

    if (!(await user.isCorrectPassword(user.password, req.body.currentPassword))) {
        return next(new AppError("Incorrect password!", 401));
    }

    // 3. if password is correct, change it to new password
    user.password = req.body.newPassword;
    user.passwordConfirm = req.body.newPasswordConfirm;
    await user.save();

    // 4. log user in => send JWT
    sendResponseWithCookie(user, 200, res);
});

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
    // 1. create error if user POSTed password data (no password updtaes)
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError("Can not update password via this route, please use /changePassword instead!", 400));
    }


    // 2. filter out fields that not allowed to be updated
    const filteredBody = helpers.filterObject(req.body, "firstName", "lastName", "email");

    // 3. update user data
    const updatedUser = await userRepo.update(req.user.id, filteredBody);

    res.status(200).json({
        status: 'success',
        data: { updatedUser }
    });
});

exports.deactivate = catchAsync(async (req, res, next) => {
    await userRepo.update(req.user.id, { active: false });

    res.status(204).json({
        status: 'success',
        data: null
    });
});