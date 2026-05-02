const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authController = require('../controllers/authController');

router.param('id', (req, res, next, val) => {
  if (!/^[a-fA-F0-9]{24}$/.test(val)) {
    return res.status(400).json({
      status: 'fail',
      message: `Invalid ID format: "${val}". Must be a valid MongoDB ObjectID.`,
    });
  }
  console.log(`[checkID] Param id = ${val}`);
  next();
});

const checkBody = (req, res, next) => {
  const { name, price, category, description, seller } = req.body;

  if (!name || price === undefined || !category || !description || !seller) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing required fields: name, price, category, description, seller',
    });
  }

  if (isNaN(price) || Number(price) < 0) {
    return res.status(400).json({
      status: 'fail',
      message: 'Price must be a non-negative number.',
    });
  }

  next();
};

router
  .route('/top-3-cheapest')
  .get(productController.aliasTopCheapest, productController.getAllProducts);

router
  .route('/product-category')
  .get(productController.getProductCategory);

router
  .route('/')
  .get(authController.protect, productController.getAllProducts)
  .post(checkBody, productController.createProduct);

router
  .route('/:id')
  .get(productController.getProduct)
  .patch(productController.updateProduct)
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    productController.deleteProduct
  );

module.exports = router;
