const mongoose = require('mongoose');

const usersSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: 'First Name is required'
  },
  lastName: {
    type: String,
    required: 'Last Name is required'
  },
  picture: String,
  email: {
    type: String,
    required: 'Email is required'
  },
  role: {
    type: [String],
    required: 'Role is required'
  },
  password: {
    type: String,
    required: 'Password is required'
  },
  status: {
    type: Boolean,
    required: 'Status is required'
  }
}, {
    timestamps: true
  }
);

const Users = mongoose.model('Users', usersSchema);

module.exports = Users;
