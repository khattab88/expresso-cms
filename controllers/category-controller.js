const { catchAsync, errorHandling } = require('expresso-utils');
const AppError = errorHandling.AppError;
const { categoryRepository } = require("expresso-repositories");

const imageHandler = require('../utils/image');

exports.getCategoryListView = catchAsync(async (req, res, next) => {
    const categories = await categoryRepository.getAll();

    res.status(200).render("category-list", {
        title: "Categories",
        categories
    });
});

exports.getCategoryDetailView = catchAsync(async (req, res, next) => {
    let category = null;

    if(req.params.id === "new") {
        category = { id: "0", name: ""};

        res.status(200).render("category-detail", {
            title: "New",
            category
        });
    } else {
        category = await categoryRepository.getById(req.params.id);

        if(!category) return next(new AppError("Threre is no category with such id!"));

        res.status(200).render("category-detail", {
            title: category.name,
            category
        });
    }
});

exports.createOrUpdateCategory = catchAsync(async (req, res, next) => {
    const id = req.body.id;

    const data = {
        name: req.body.name
    };

    if (req.files[0]) {
        const fileName = req.files[0].filename;

        // console.log(imageHandler.folderName);

        /// encode image to base64
        data.image = await imageHandler.saveImageAsBase64(fileName);
        
        /// delete image from uploads folder
        imageHandler.deleteImage(fileName);
    }

    if(id === "0") {
        const newCategory = await categoryRepository.create(data);

        res.redirect("/categories");
    } else {
        const updatedCategory = await categoryRepository.update(id, data);

        res.redirect(`/categories/${updatedCategory.id}`);
    }
});

exports.deleteCategory = catchAsync(async (req, res, next) => {
    await categoryRepository.delete(req.params.id);
});