const mongoose = require('mongoose');

const vendorsSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: 'First Name is required'
  },
  lastName: {
    type: String,
    required: 'Last Name is required'
  },
  picture: String,
  suffix: {
    type: String,
    required: 'Suffix is required'
  },
  company: String,
  email: {
    type: String,
    required: 'Email is required'
  },
  phone: [String],
  website: String,
  listingFee: String,
  address: String,
  city: String,
  state: String,
  country: String,
  zip: String,
  status: {
    type: Boolean,
    required: 'Status is required'
  }
}, {
    timestamps: true
  }
);

const Vendors = mongoose.model('Vendors', vendorsSchema);

module.exports = Vendors; 
