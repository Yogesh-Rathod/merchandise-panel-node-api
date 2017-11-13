// ========== Global Dependencies ============ //
const express = require('express');
const app = express();
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const bodyParser = require('body-parser');
const validator = require('express-validator');
const convertExcel = require('excel-as-json').processFile;

const _ = require('lodash');
const async = require('async');

// ========== Local Dependencies ============= //
const Products = require('../model/Products');

const sendMail = require('./mailer');

// ========== Setting Up Middlewares ============= //

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(validator());

module.exports = {

  getAllProducts: (req, res) => {
    let query = Products.find();

    // Get All Query Params in 1 Object
    var queryConditions = {};
    if (req.query.name) {
      queryConditions.name = { $regex: req.query.name, $options: "i" };
    }
    if (req.query.status && req.query.status !== 'all') {
      queryConditions.status = req.query.status;
    }
    if (req.query.id) {
      queryConditions._id = req.query.id;
    }
    if (req.query.vendor && req.query.vendor !== 'all') {
      queryConditions.vendor = req.query.vendor;
    }
    
    // Apply Filters
    if (!_.isEmpty(queryConditions)) {
      query = Products.find(queryConditions);
    }

    query.exec((err, products) => {
      if (err) {
        return res.status(500).json(err);
      }
      const response = {
        status: 200,
        message: "Everything's Fine",
        data: products
      };
      res.json(response);
    });
  },


  getSingleProduct: (req, res) => {
    Products.find({ _id: req.params.id }).exec((err, product) => {
      if (err) {
        return res.json(err);
      }
      const response = {
        status: 200,
        message: "Everything's Fine",
        data: product
      };
      res.json(response);
    });
  },

  addAProduct: (req, res) => {
    req.checkBody("name", "Name is required").notEmpty();
    req.checkBody("shortDescription", "Short Description is required.").notEmpty();
    req.checkBody("status", "Status is required.").notEmpty();
    req.checkBody("MrpPrice", "MRP Price is required.").notEmpty();
    req.checkBody("vendor", "Vendor is required.").notEmpty();
    const errors = req.validationErrors();
    if (errors) {
      res.status(400).json(errors);
    } else {
      const product = new Products(req.body);
      product.save((err, success) => {
        if (err) {
          return res.status(500).json(err);
        }
        const response = {
          status: 200,
          message: "Everything's Fine",
          data: success
        };
        res.json(response);
      });
    }
  },

  bulkVendorUpload: (req, res) => {

    convertExcel(req.file.path, undefined, undefined, (err, success) => {
      if (err) {
        return res.status(500).json(err);
      } else {
        const incorrectRows = [];
        async.series([
          (callback) => {
            _.forEach(success, (vendorInfo, index) => {
              const checkParameters = vendorInfo.firstName !== '' && vendorInfo.lastName !== '' && vendorInfo.suffix !== '' && vendorInfo.status !== '' && vendorInfo.email !== '';
              if (checkParameters) {

                const vendor = new Vendors(vendorInfo);
                vendor.save((err, success) => {
                  if (err) {
                  }
                });
              } else {
                incorrectRows.push(index);
              }
            });
            callback(null, incorrectRows);
          }
        ],
          function (err, results) {
            const response = {
              status: 200,
              message: "Everything's Fine",
              incorrectRowIndex: results[0]
            };
            res.json(response);
          });
      }
    });
  },

  updateAProduct: (req, res) => {
    req.checkBody("name", "Name is required").notEmpty();
    req.checkBody("shortDescription", "Short Description is required.").notEmpty();
    req.checkBody("status", "Status is required.").notEmpty();
    req.checkBody("MrpPrice", "MRP Price is required.").notEmpty();
    req.checkBody("vendor", "Vendor is required.").notEmpty();
    const errors = req.validationErrors();
    if (errors) {
      res.status(400).json(errors);
    } else {
      const updateProduct = req.body;
      Products.findByIdAndUpdate({ _id: req.params.id }, { $set: updateProduct }).exec((err, success) => {
        if (err) {
          return res.status(500).json(err);
        }
        const response = {
          status: 200,
          message: "Everything's Fine",
          data: success
        };
        res.json(response);
      });
    }
  },

  deleteProduct: (req, res) => {
    Products.findByIdAndRemove({ _id: req.params.id }).exec((err, success) => {
      if (err) {
        return res.status(500).json(err);
      }
      const response = {
        status: 200,
        message: "Everything's Fine",
        data: success
      };
      res.json(response);
    });
  },

  deleteMultipleVendors: (req, res) => {
    const idsArray = req.body.ids;
    if (idsArray.length === 0) {
      const response = {
        status: 402,
        message: "Empty Array of Ids.",
        data: []
      };
      res.json(response);
    } else {
      Vendors.deleteMany({ _id: { $in: idsArray } }, (err, success) => {
        if (err) {
          return res.status(500).json(err);
        }
        const response = {
          status: 200,
          message: "Everything's Fine",
          data: success
        };
        res.json(response);
      });
    }
  }


}
