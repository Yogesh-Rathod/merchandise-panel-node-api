// ========== Global Dependencies ============ //
const express = require('express')
const app = express();
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const bodyParser = require('body-parser');
const validator = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const _ = require('lodash');
const async = require('async');

// ========== Local Dependencies ============= //
const Users = require('../model/Users');
const sendMail = require('./mailer');
const config = require('../config');

// ========== Setting Up Middlewares ============= //

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(validator());

module.exports = {

  authenticateUser: (req, res) => {
    req.checkBody("email", "Email is required").notEmpty();
    req.checkBody("password", "Password is required.").notEmpty();
    const errors = req.validationErrors();
    if (errors) {
      res.status(400).json(errors);
    } else {
      Users.findOne({ email: req.body.email }).exec((err, user) => {
        if (!user) {
          const response = {
            status: 403,
            message: "User does not exists"
          };
          res.json(response);
          return;
        }
        if (user) {
          bcrypt.compare(req.body.password, user.password, (err, matched) => {
            if (matched) {
              const token = jwt.sign({}, config.jwtSecret, {});
              const response = {
                status: 201,
                message: "Everything's Fine",
                userInfo: {
                  name: user.firstName + ' ' + user.lastName,
                  email: user.email,
                  role: user.role
                },
                token: token
              };
              res.json(response);
              return;
            } else {
              const response = {
                status: 403,
                message: "Password is wrong."
              };
              res.json(response);
            }
          });
        }
      });
    }
  },

  getAllUsers: (req, res) => {
    let query = Users.find();
    const searchTerm = req.query.name;
    if (searchTerm) {
      query = Users.find({ '$or': [{ firstName: { "$regex": searchTerm, '$options': 'i' } }, { lastName: { "$regex": searchTerm, '$options': 'i' }}]});
    }

    query.exec((err, users) => {
      if (err) {
        return res.status(500).json(err);
      }
      const response = {
        status: 200,
        message: "Everything's Fine",
        data: users
      };
      res.json(response);
    });
  },


  getSingleUser: (req, res) => {
    Users.find({ _id: req.params.id }).exec((err, user) => {
      if (err) {
        return res.json(err);
      }
      const response = {
        status: 200,
        message: "Everything's Fine",
        data: user
      };
      res.json(response);
    });
  },

  addAUser: (req, res) => {
    req.checkBody("firstName", "First Name is required").notEmpty();
    req.checkBody("lastName", "Last Name is required.").notEmpty();
    req.checkBody("email", "Email is required.").notEmpty();
    req.checkBody("role", "Role is required").notEmpty();
    req.checkBody("password", "Password is required.").notEmpty();
    req.checkBody("status", "Status is required.").notEmpty();
    const errors = req.validationErrors();
    if (errors) {
      res.status(400).json(errors);
    } else {
      Users.findOne({ email: req.body.email }).exec((err, user) => {
        if (user) {
          const response = {
            status: 401,
            message: "User already exists"
          };
          res.json(response);
        } else {
          const user = new Users(req.body);
          const hash = bcrypt.hashSync(user.password, 10);
          user.password = hash;
          user.save((err, success) => {
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

  updateAUser: (req, res) => {
    req.checkBody("firstName", "First Name is required").notEmpty();
    req.checkBody("lastName", "Last Name is required.").notEmpty();
    req.checkBody("email", "Email is required.").notEmpty();
    req.checkBody("role", "Role is required").notEmpty();
    req.checkBody("password", "Password is required.").notEmpty();
    req.checkBody("status", "Status is required.").notEmpty();
    const errors = req.validationErrors();
    if (errors) {
      res.status(400).json(errors);
    } else {
      const updateUser = req.body;
      Users.findByIdAndUpdate({ _id: req.params.id }, { $set: updateUser }).exec((err, success) => {
        if (err) {
          return res.status(500).json(err);
        }
        // sendMail(success.email, 'vendorInfoUpdated');
        const response = {
          status: 200,
          message: "Everything's Fine",
          data: success
        };
        res.json(response);
      });
    }
  },

  deleteAUser: (req, res) => {
    Users.findByIdAndRemove({ _id: req.params.id }).exec((err, success) => {
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
