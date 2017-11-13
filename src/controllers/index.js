// ========== Global Dependencies ============ // vendorUpload
const express = require('express')
const app = express();
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const upload = multer({ dest: 'uploads/vendors' });

// ========== Local Dependencies ============= //
const Categories = require('../model/Categories');

const categoryFunctions = require('./CategoriesFunctions');

const vendorFunctions = require('./VendorsFunctions');

const productsFunctions = require('./ProductsFunctions.js');

// ========== Setting Up Middlewares ============= //

// ========== Auth Route to get JWT token ============= //
// router.post('/authenticate', dbOperations.authenticateUser);

// ========== JWT check for All Routes ============= //
// router.use((req, res, next) => {

//   var token = req.body.token || req.query.token || req.headers['x-access-token'];

//   if (token) {

//     jwt.verify(token, config.jwtSecret, (err, decoded) => {
//       if (err) {
//         return res.json(
//           {
//             success: false,
//             message: 'Failed to authenticate token.'
//           }
//         );
//       } else {
//         req.decoded = decoded;
//         next();
//       }
//     });

//   } else {
//     return res.status(403).send({
//       success: false,
//       message: 'No token provided.'
//     });

//   }
// });


// ========== All API Routes Below ============= //

router.get('/', (req, res) => {
  res.status(200).json('API server is Running Fine!!!');
});

//  ==  Categoties Routes

router.get('/categories', categoryFunctions.getAllCategories);

router.get('/category/:id', categoryFunctions.getSingleCategory);

router.post('/category', categoryFunctions.addACategory);

router.post('/updateCategory/:id', categoryFunctions.updateACategory);

router.get('/deleteCategory/:id', categoryFunctions.deleteCategory);

// ==  Vendors Routes

router.get('/vendors', vendorFunctions.getAllVendors);

router.get('/vendor/:id', vendorFunctions.getSingleVendor);

router.post('/vendor', vendorFunctions.addAVendor);

router.post('/bulkVendorUpload', upload.single('vendorUpload'), vendorFunctions.bulkVendorUpload);

router.post('/updateVendor/:id', vendorFunctions.updateAVendor);

router.get('/deleteVendor/:id', vendorFunctions.deleteVendor);

router.post('/deleteMultipleVendors', vendorFunctions.deleteMultipleVendors);

//  ==  Products Routes

router.get('/products', productsFunctions.getAllProducts);

router.get('/product/:id', productsFunctions.getSingleProduct);

router.post('/product', productsFunctions.addAProduct);

router.post('/updateProduct/:id', productsFunctions.updateAProduct);

router.get('/deleteProduct/:id', productsFunctions.deleteProduct);

module.exports = router;



