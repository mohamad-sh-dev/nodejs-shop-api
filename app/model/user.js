/* eslint-disable eqeqeq */
/* eslint-disable func-names */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const createHttpError = require('http-errors');
const { StatusCodes: httpStatusCodes } = require('http-status-codes');
const { ProductModel } = require('./product');
const { CourseModel } = require('./courses');
const { messageCenter } = require('../utilities/messages');

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
    },
    discount: {
      type: String,
    },
    birthDate: {
      type: String,
    },
    purchasedCourses: {
      type: [mongoose.Schema.ObjectId],
      ref: 'Course'
    },
    purchasedProducts: {
      type: [mongoose.Schema.ObjectId],
      ref: 'Product'
    },
    cart: {
      products: [{
        productID: {
          type: mongoose.Schema.ObjectId,
          ref: 'Product'
        },
        quantity: {
          type: Number,
          default: 0
        },
        totalPrice: {
          type: Number
        },
        finalPrice: {
          type: Number
        }
      }],
      courses: [{
        courseID: {
          type: mongoose.Schema.ObjectId,
          ref: 'Course'
        },
        totalPrice: {
          type: Number
        },
        finalPrice: {
          type: Number
        }
      }],
      totalPayAmounts: {
        coursesAmount: {
          type: Number,
          default: 0
        },
        productsAmount: {
          type: Number,
          default: 0
        },
        totalAmount: {
          type: Number,
          default: 0
        },
      }
    }
  },
  {
    timestamps: true,
  }
);

userSchema.methods.addProductToUserCart = async function (productID) {
  const findProductResult = await ProductModel.findOne({ _id: productID });
  if (!findProductResult) {
    throw createHttpError.NotFound(httpStatusCodes.NOT_FOUND);
  }
  const existingProductIndex = this.cart.products.findIndex(
    (product) => product.productID.toString() === productID
  );
  if (existingProductIndex !== -1) {
    this.cart.products[existingProductIndex].quantity += 1;
  } else {
    this.cart.products.push({
      productID: findProductResult.id,
      quantity: 1,
    });
    this.calculateUserCart();
  }
  // await this.save();
};
userSchema.methods.removeProductFromUserCart = async function (productID) {
  const findProductResult = await ProductModel.findOne({ _id: productID });
  if (!findProductResult) {
    throw createHttpError.NotFound(httpStatusCodes.NOT_FOUND);
  }
  const existingProductIndex = this.cart.products.findIndex(
    (product) => product.productID.toString() === productID
  );
  if (existingProductIndex !== -1) {
    if (this.cart.products[existingProductIndex].quantity !== 1) {
      this.cart.products[existingProductIndex].quantity += -1;
    } else {
      this.cart.products.pull(this.cart.products[existingProductIndex]);
    }
  } else {
    throw createHttpError.NotFound(messageCenter.USER_CART.NOT_FOUND_PRODUCT_IN_CART);
  }
  await this.save();
};

userSchema.methods.addCourseToUserCart = async function (courseID) {
  const findCourseResult = await CourseModel.findOne({ _id: courseID });
  if (!findCourseResult) {
    throw createHttpError.NotFound(messageCenter.public.notFoundContent);
  }
  const existingCourseIndex = this.cart.courses.findIndex(
    (course) => course.courseID == courseID
  );
  if (existingCourseIndex !== -1) {
    throw createHttpError.BadRequest(messageCenter.COURSES.COURSE_ALREADY_EXIST);
  } else {
    this.cart.courses.push({
      courseID: findCourseResult.id,
      quantity: 1,
    });
  }
  await this.save();
};
userSchema.methods.removeCourseFromUserCart = async function (courseID) {
  const existingCourseIndex = this.cart.courses.findIndex(
    (course) => course.courseID.toString() === courseID
  );
  if (existingCourseIndex !== -1) {
    this.cart.courses.pull(this.cart.courses[existingCourseIndex]);
  } else {
    throw createHttpError.NotFound(messageCenter.COURSES.NOT_FOUND_COURSE_IN_CART);
  }
  await this.save();
};
userSchema.methods.calculateUserCart = async function () {
  const populatedProducts = await this.model('User')
    .populate(this, {
      path: 'cart.products.productID',
      select: 'title summary description price discount',
      model: 'Product',
    });
  const populatedCourses = await this.model('User')
    .populate(this, {
      path: 'cart.courses.courseID',
      select: 'title summary description price discount',
      model: 'Course',
    });
  this.cart.products = populatedProducts.cart.products;
  this.cart.courses = populatedCourses.cart.courses;
  const totalPayAmounts = {
    productsAmount: 0,
    coursesAmount: 0,
    totalPayAmount: 0,
    productIDs: [],
    courseIDs: []
  };
  this.cart.products = this.cart.products.map((product) => {
    const { price, discount } = product.productID;
    const totalPrice = price * product.quantity;
    const finalPrice = totalPrice - ((discount / 100) * price);
    this.cart.totalPayAmounts.productsAmount += finalPrice;
    totalPayAmounts.productsAmount += finalPrice;
    totalPayAmounts.productIDs.push(product.productID.id);
    return { ...product, totalPrice, finalPrice };
  });

  this.cart.courses = this.cart.courses.map((course) => {
    const { price, discount } = course.courseID;
    const finalPrice = price - ((discount / 100) * price);
    this.cart.totalPayAmounts.coursesAmount += finalPrice;
    totalPayAmounts.coursesAmount += finalPrice;
    totalPayAmounts.courseIDs.push(course.courseID.id);
    return { ...course, totalPrice: finalPrice, finalPrice };
  });
  this.cart.totalPayAmounts.totalAmount = this.cart.totalPayAmounts.coursesAmount + this.cart.totalPayAmounts.productsAmount;
  await this.save();
  totalPayAmounts.totalPayAmount = totalPayAmounts.productsAmount + totalPayAmounts.coursesAmount;
  return {
    ...this.cart,
    totalPayAmounts
  };
};

userSchema.pre('aggregate', function (next) {
  this.project('-createdAt -updatedAt -__v -role -otp');
  next();
});

userSchema.pre('find', function (next) {
  this.select('-createdAt -updatedAt -__v -role -otp');
  next();
});
// userSchema.pre('findOne', function (next) {
//   this.select('-createdAt -updatedAt -__v -role -otp');
//   next();
// });

userSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next();
  this.password = bcrypt.hash(this.password, 10);
  next();
});

userSchema.method('comparePassword', async (savedPass, enteredPass) => bcrypt.compare(enteredPass, savedPass));
userSchema.index({
  firstName: 'text', lastName: 'text', username: 'text', email: 'text', mobile: 'text',
});
const UserModel = mongoose.model('User', userSchema);
module.exports = {
  UserModel,
};
