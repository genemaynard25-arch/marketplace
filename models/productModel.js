const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A product must have a name'],
      unique: true,
      trim: true,
      maxlength: [100, 'Product name must not exceed 100 characters'],
    },
    price: {
      type: Number,
      required: [true, 'A product must have a price'],
      min: [0, 'Price must be a positive number'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: 'Discount price ({{VALUE}}) should be below the regular price',
      },
    },
    category: {
      type: String,
      required: [true, 'A product must have a category'],
      trim: true,
      enum: {
        values: ['Electronics', 'Books', 'Clothes', 'Sports', 'Furniture', 'Others'],
        message: 'Category must be one of: Electronics, Books, Clothes, Sports, Furniture, Others',
      },
    },
    description: {
      type: String,
      required: [true, 'A product must have a description'],
      trim: true,
      maxlength: [50, 'Description must not exceed 50 characters'],
    },
    seller: {
      type: String,
      required: [true, 'A product must have a seller name'],
      trim: true,
    },
    ratingsAverage: {
      type: Number,
      default: 3.0,
      min: [1, 'Rating must be at least 1.0'],
      max: [5, 'Rating must not exceed 5.0'],
    },
    stock: {
      type: Number,
      default: 1,
      min: [0, 'Stock cannot be negative'],
    },
    postedDate: {
      type: Date,
      default: Date.now,
    },
    productSlug: String,
    premiumProduct: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.virtual('daysPosted').get(function () {
  if (!this.postedDate) return null;
  const now = new Date();
  const posted = new Date(this.postedDate);
  return Math.floor((now - posted) / (1000 * 60 * 60 * 24));
});

productSchema.pre('save', function (next) {
  try {
    this.productSlug = slugify(this.name, { lower: false }).toUpperCase();
    next();
  } catch (err) {
    next(err);
  }
});

productSchema.post('save', function (doc) {
  console.log(`[POST SAVE] Product saved: ${doc.name} | Slug: ${doc.productSlug}`);
});

productSchema.pre(/^find/, function () {
  this.start = Date.now();
  this.find({ premiumProduct: { $ne: true } });
});

productSchema.post(/^find/, function (docs) {
  console.log(`[QUERY] Took ${Date.now() - this.start}ms`);
});

productSchema.pre('aggregate', function () {
  this.pipeline().unshift({ $match: { premiumProduct: { $ne: true } } });
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
