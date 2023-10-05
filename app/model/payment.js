const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    invoiceNumber: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
    },
    authority: {
      type: String,
      required: true
    },
    primaryPayStatus: {
      type: Boolean,
      required: true
    },
    verify: {
      type: Boolean,
      required: true,
      default: false
    },
    userCart: {
      type: Object,
      required: true
    }
  },
  {
    timestamps: true,
  }
);
const PaymentModel = mongoose.model('Payment', PaymentSchema);
module.exports = {
  PaymentModel,
};
