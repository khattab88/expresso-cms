/* eslint-disable prettier/prettier */
const { catchAsync, errorHandling } = require('expresso-utils');
const AppError = errorHandling.AppError;
const { tagRepository } = require("expresso-repositories");


exports.getTagListView = catchAsync(async (req, res) => {

    const tags = await tagRepository.getAll();

    res.status(200).render("tag-list", {
        title: "Tags",
        tags
    });
});

exports.getTagDetailView = catchAsync(async (req, res, next) => {
    if (req.params.id === "new") {
        const emptyTag = { id: 0, name: "" };

        res.status(200).render("tag-detail", {
            title: "New",
            tag: emptyTag
        });
    } else {
        const tag = await tagRepository.getById(req.params.id);

        if (!tag) {
            return next(new AppError("There is no tag with that id!", 404));
        }

        res.status(200).render("tag-detail", {
            title: tag.name,
            tag
        });
    }
});

exports.createOrUpdateTag = catchAsync(async (req, res, next) => {
    const id = req.body.id;

    if (id === "0") {
        const newTag = await tagRepository.create({ name: req.body.name });

        res.redirect(`/tags/`);
    } else {
        const updatedTag = await tagRepository.update(id, {
            name: req.body.name
        });

        res.redirect(`/tags/${updatedTag.id}`);
    }
});

exports.deleteTag = catchAsync(async (req, res, next) => {
    await tagRepository.delete(req.params.id);

    // res.redirect(`/tags/`);
});
