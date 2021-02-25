const { catchAsync, errorHandling } = require('expresso-utils');
const AppError = errorHandling.AppError;
const { categoryRepository } = require("expresso-repositories");

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
    } else {
        category = await categoryRepository.getById(req.params.id);

        if(!category) return next(new AppError("Threre is no category with such id!"));
    } 

    res.status(200).render("category-detail", {
        title: "New",
        category
    });
});

exports.createOrUpdateCategory = catchAsync(async (req, res, next) => {
    const id = req.body.id;

    if(id === "0") {
        const newCategory = await categoryRepository.create({ name: req.body.name });

        res.redirect("/categories");
    } else {
        const updatedCategory = await categoryRepository.update(id, {
            name: req.body.name
        });

        res.redirect(`/categories/${updatedCategory.id}`);
    }
});

exports.deleteCategory = catchAsync(async (req, res, next) => {
    await categoryRepository.delete(req.params.id);
});