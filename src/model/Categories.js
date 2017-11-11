const mongoose = require('mongoose');

const categoriesSchema = mongoose.Schema({
  name: {
    type: String,
    required: 'Name is required'
  },
  displayName: String,
  description: String,
  picture: String,
  parent: String,
  breadCrumb: {
    type: String,
    required: 'Bread Crumb is required'
  },
  displayOrder: Number,
  status: {
    type: Boolean,
    required: 'Status is required'
  }
}, {
    timestamps: true
  });

const Categories = mongoose.model('Categories', categoriesSchema);

module.exports = Categories;
