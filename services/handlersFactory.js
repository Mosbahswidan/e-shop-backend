const asyncHandler = require("express-async-handler");
const apiError = require("../utils/apiError");
const ApiFeature = require("../utils/apiFeature");

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const document = await Model.findByIdAndDelete(id);
    if (!document) {
      // eslint-disable-next-line new-cap
      return next(new apiError(`No product found for id:${id}`, 404));
    }
    document.remove();
    res.status(204).send();
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!document) {
      return next(
        // eslint-disable-next-line new-cap
        new apiError(`No document for this id ${req.params.id}`, 404)
      );
    }
    document.save();
    res.status(200).json({ data: document });
  });

exports.createOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const category = await Model.create(req.body);
    res.status(201).json({ data: category });
  });
exports.getOne = (Model, populateOpt) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    let query = await Model.findById(id);
    if (populateOpt) {
      query = query.populate(populateOpt);
    }
    const Brand = await query;
    if (!Brand) {
      console.log("No Brand");

      // eslint-disable-next-line new-cap
      return next(new apiError(`No item found for id:${id}`, 404));
    }
    res.status(200).json({ result: 1, data: Brand });
  });

exports.getAll = (Model) =>
  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObject) {
      filter = req.filterObject;
    }
    const docCount = await Model.countDocuments();
    // eslint-disable-next-line no-use-before-define
    const apiFeatures = new ApiFeature(Model.find(filter), req.query)
      .paginate(docCount)
      .filter()
      .search()
      .limitFields()
      .sort();
    const { mongooseQuery, paginationResult } = apiFeatures;
    const doc = await mongooseQuery;
    // const categories = await BrandModel.find({});
    res.status(200).json({ result: doc.length, paginationResult, data: doc });
  });
