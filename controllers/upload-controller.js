const multer = require('multer');
const sharp = require('sharp');

const { catchAsync, errorHandling } = require('expresso-utils');
const AppError = errorHandling.AppError;

const multerStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        /// FILEPATH
        callback(null, "public/img/uploads");
    },
    filename: (req, file, callback) => {
        ///FILENAME: image-{resource-id}-{timestamp}.{ext}
        const ext = file.mimetype.split("/")[1];
        callback(null, `image-${req.body.id}-${Date.now()}.${ext}`);
    }
});

/// USE THIS ONLY IF USING RESIZE IMAGE MIDDLEWARE 
// const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, callback) => {
    if(file.mimetype.startsWith("image")) {
        callback(null, true);
    } else {
        callback(new AppError("Not an image, please upload an image file!", 400), false);
    }
};

const upload = multer({ 
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadImage = upload.single("image");

exports.resizeImage = (req, res, next) => {
    if(!req.file) return next();

    req.file.filename = `image-${req.body.id}-${Date.now()}.jpeg`;

    sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/img/uploads/${req.file.filename}`);

    next();
};