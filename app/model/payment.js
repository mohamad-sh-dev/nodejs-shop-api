const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema(
  {},
  {
    timestamps: true,
  }
);
const PaymentModel = mongoose.model('Payment', PaymentSchema);
module.exports = {
  PaymentModel,
};
