const mongoose = require('mongoose');

const sliderSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    image: {
        type: String,
        default: '/uploads/silders/default.png',
    },
    type: {
      type: String,
      default: 'main'
    }
  },
  {
    timestamps: true,
  }
);
const SliderModel = mongoose.model('Slider', sliderSchema);
module.exports = {
  SliderModel,
};
