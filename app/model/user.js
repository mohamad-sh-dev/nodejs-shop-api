/* eslint-disable func-names */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      lowercase: true,
    },
    lastName: {
      type: String,
      lowercase: true,
    },
    username: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
    },
    mobile: {
      type: String,
      required: true
    },
    role: {
      type: String,
      default: 'USER',
    },
    otp: {
      type: Object,
      default: {
        token: 0,
        expiresIn: 0,
      },
    },
    profileImage: {
      type: String,
      default: '/uploads/users/profileImages/default.png',
    },
    discount: {
      type: String,
    },
    birthDate: {
      type: String,
    },
    courses: { type: [mongoose.Schema.ObjectId], ref: 'Courses', default: [] }
  },
  {
    timestamps: true,
  }
);

userSchema.pre('aggregate', function (next) {
  this.project('-createdAt -updatedAt -__v -role -otp');
  next();
});

userSchema.pre('find', function (next) {
  this.select('-createdAt -updatedAt -__v -role -otp');
  next();
});
userSchema.pre('findOne', function (next) {
  this.select('-createdAt -updatedAt -__v -role -otp');
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next();
  this.password = bcrypt.hash(this.password, 10);
  next();
});

userSchema.method('comparePassword', async (savedPass, enteredPass) => bcrypt.compare(enteredPass, savedPass));

const UserModel = mongoose.model('User', userSchema);
module.exports = {
  UserModel,
};
