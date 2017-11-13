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
const Categories = require('../model/Categories');

// ========== Setting Up Middlewares ============= //

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(validator());

module.exports = {

  getAllCategories: (req, res) => {
    let query = Categories.find();
    if (req.query.name) {
      query = Categories.find({ name: { "$regex": req.query.name, '$options': 'i' }  });
    }

    query.exec((err, categories) => {
      if (err) {
        return res.status(500).json(err);
      }
      const response = {
        status: 200,
        message: "Everything's Fine",
        data: categories
      };
      res.json(response);
    });
  },


  getSingleCategory: (req, res) => {
    Categories.find({ _id: req.params.id }).exec((err, category) => {
      if (err) {
        return res.json(err);
      }
      const response = {
        status: 200,
        message: "Everything's Fine",
        data: category
      };
      res.json(response);
    });
  },

  addACategory: (req, res) => {
    req.checkBody("name", "Name is required").notEmpty();
    req.checkBody("breadCrumb", "BreadCrumb is required.").notEmpty();
    req.checkBody("status", "status is required.").notEmpty();
    const errors = req.validationErrors();
    if (errors) {
      res.status(400).json(errors);
    } else {
      const category = new Categories(req.body);
      category.save((err, success) => {
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

  updateACategory: (req, res) => {

    req.checkBody("name", "Name is required").notEmpty();
    req.checkBody("breadCrumb", "BreadCrumb is required.").notEmpty();
    req.checkBody("status", "status is required.").notEmpty();
    const errors = req.validationErrors();
    if (errors) {
      res.status(400).json(errors);
    } else {
      const updateCategory = req.body;
      Categories.findByIdAndUpdate( { _id: req.params.id } , { $set: updateCategory }).exec((err, success) => {
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

  deleteCategory: (req, res) => {
    Categories.findByIdAndRemove({ _id: req.params.id } ).exec((err, success) => {
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
