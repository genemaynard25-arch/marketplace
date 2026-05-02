const Product = require('../models/productModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.aliasTopCheapest = (req, res, next) => {
  req.query.limit = '3';
  req.query.sort = 'price';
  req.query.fields = 'name,price,category,seller,description';
  next();
};

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Product.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const products = await features.query;

  res.status(200).json({
    status: 'success',
    results: products.length,
    data: { products },
  });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError(`No product found with ID: ${req.params.id}`, 404));
  }

  res.status(200).json({ status: 'success', data: { product } });
});

exports.createProduct = catchAsync(async (req, res, next) => {
  const newProduct = await Product.create(req.body);
  res.status(201).json({ status: 'success', data: { product: newProduct } });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { returnDocument: 'after', runValidators: true }
  );

  if (!product) {
    return next(new AppError(`No product found with ID: ${req.params.id}`, 404));
  }

  res.status(200).json({ status: 'success', data: { product } });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return next(new AppError(`No product found with ID: ${req.params.id}`, 404));
  }

  res.status(204).json({ status: 'success', data: null });
});

exports.getProductCategory = catchAsync(async (req, res, next) => {
  const stats = await Product.aggregate([
    {
      $match: { price: { $lt: 1000 } },
    },
    {
      $group: {
        _id: { $toUpper: '$category' },
        numProducts: { $sum: 1 },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: { stats },
  });
});
