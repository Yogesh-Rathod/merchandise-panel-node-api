// ========== Global Dependencies ============ //
const express = require('express')
const app = express();
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const bodyParser = require('body-parser');
const validator = require('express-validator');

const _ = require('lodash');
const async = require('async');

// ========== Local Dependencies ============= //
const Vendors = require('../model/Vendors');

// ========== Setting Up Middlewares ============= //

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(validator());

module.exports = {

  getAllVendors: (req, res) => {
    let query = Vendors.find();
    const searchTerm = req.query.name;
    if (searchTerm) {
      query = Vendors.find({ '$or': [{ firstName: { "$regex": searchTerm } }, { lastName: { "$regex": searchTerm }}]});
    }

    query.exec((err, vendors) => {
      if (err) {
        return res.status(500).json(err);
      }
      const response = {
        status: 200,
        message: "Everything's Fine",
        data: vendors
      };
      res.json(response);
    });
  },


  getSingleVendor: (req, res) => {
    Vendors.find({ _id: req.params.id }).exec((err, vendor) => {
      if (err) {
        return res.json(err);
      }
      const response = {
        status: 200,
        message: "Everything's Fine",
        data: vendor
      };
      res.json(response);
    });
  },

  addAVendor: (req, res) => {
    req.checkBody("firstName", "First Name is required").notEmpty();
    req.checkBody("lastName", "Last Name is required.").notEmpty();
    req.checkBody("suffix", "Suffix is required.").notEmpty();
    req.checkBody("email", "email is wrong.").isEmail();
    req.checkBody("status", "status is required.").notEmpty();
    const errors = req.validationErrors();
    if (errors) {
      res.status(400).json(errors);
    } else {
      Vendors.findOne({ email: req.body.email }).exec((err, success) => {
        if (err) {
          return res.status(500).json(err);
        } else if (success) {
          const response = {
            status: 401,
            message: "User already exists"
          };
          res.json(response);
        } else if (!success) {
          const vendor = new Vendors(req.body);
          vendor.save((err, success) => {
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
      });
    }
  },

  updateAVendor: (req, res) => {
    req.checkBody("firstName", "First Name is required").notEmpty();
    req.checkBody("lastName", "Last Name is required.").notEmpty();
    req.checkBody("suffix", "Suffix is required.").notEmpty();
    req.checkBody("email", "email is wrong.").isEmail();
    req.checkBody("status", "status is required.").notEmpty();
    const errors = req.validationErrors();
    if (errors) {
      res.status(400).json(errors);
    } else {
      const updateVendor = req.body;
      Vendors.findByIdAndUpdate({ _id: req.params.id }, { $set: updateVendor }).exec((err, success) => {
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

  deleteVendor: (req, res) => {
    Vendors.findByIdAndRemove({ _id: req.params.id }).exec((err, success) => {
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
