const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config({ path: path.join(__dirname, 'config.env') });

const Product = require('./models/productModel');

const DB = process.env.DATABASE.replace(
  '<db_password>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => console.log('DB connected successfully!'));

const products = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data/products.json'), 'utf-8')
);

const importData = async () => {
  try {
    await Product.insertMany(products, { validateBeforeSave: false });
    console.log('✅ Data successfully imported!');
  } catch (err) {
    console.error('❌ Error importing data:', err.message);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Product.deleteMany();
    console.log('✅ All data deleted!');
  } catch (err) {
    console.error('❌ Error deleting data:', err.message);
  }
  process.exit();
};

if (process.argv[2] === '--import') importData();
if (process.argv[2] === '--delete') deleteData();
