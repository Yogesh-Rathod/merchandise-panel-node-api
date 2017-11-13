const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productsSchema = mongoose.Schema({
  name: {
    type: String,
    required: 'Name is required'
  },
  shortDescription: {
    type: String,
    required: 'Short Description is required'
  },
  fullDescription: String,
  sku: String,
  status: {
    type: String,
    required: 'Status is required'
  },
  oldPrice: String,
  MrpPrice: {
    type: String,
    required: 'MRP Price is required'
  },
  applicableDate: String,
  stockQuantity: Number,
  vendor: {
    type: Schema.Types.ObjectId,
    required: 'Vendor ID is required'
  },
  approvalStatus: {
    type: String,
    default: 'Pending'
  },
  images: [Schema.Types.Mixed],
  brand: String
}, {
    timestamps: true
  }
);

const Products = mongoose.model('Products', productsSchema);

module.exports = Products;
