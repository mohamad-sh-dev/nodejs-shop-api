const createHttpError = require('http-errors');
const JWT = require('jsonwebtoken');
const redisCilent = require('./initRedis');
const { UserModel } = require('../model/user');

function randomTokenGenerator() {
  return Math.floor(Math.random() * 10000);
}

function signAccessToken(user) {
  return new Promise((resolve, reject) => {
    try {
      const payload = {
        mobile: user.mobile,
      };
      const options = {
        expiresIn: '1d',
      };
      const secretKey = process.env.ACCESS_TOKEN_SECRET;
      JWT.sign(payload, secretKey, options, (err, token) => {
        if (err) throw err;
        resolve(token);
      });
    } catch (error) {
      reject(error);
    }
  });
}
function signRefreshToken(user) {
  return new Promise((resolve, reject) => {
    try {
      const payload = {
        mobile: user.mobile,
      };
      const options = {
        expiresIn: '1y',
      };
      const secretKey = process.env.REFRESH_TOKEN_SECRET;
      JWT.sign(payload, secretKey, options, async (err, token) => {
        if (err) throw err;
        await redisCilent.set(user.id, token);
        resolve(token);
      });
    } catch (error) {
      reject(error);
    }
  });
}
async function verifyToken(token) {
  return new Promise((resolve, reject) => {
    try {
      JWT.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decodedToken) => {
          if (err) reject(createHttpError.BadRequest('توکن نامعتبر'));
          resolve(decodedToken);
        },
      );
    } catch (error) {
      reject(error);
    }
  });
}
async function verifyRefreshToken(token) {
  return new Promise((resolve, reject) => {
    try {
      JWT.verify(
        token,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, tokenPayload) => {
          if (err) reject(createHttpError.BadRequest('توکن نامعتبر'));
          const { mobile } = tokenPayload || {};
          const user = await UserModel.findOne({ mobile }, { password: 0, otp: 0 });
          const userRefreshTokne = await redisCilent.get(user.id);
          if (userRefreshTokne === token) resolve(mobile);
          else reject(createHttpError.Unauthorized('توکن نامعتبر'));
        },
      );
    } catch (error) {
      reject(error);
    }
  });
}
function filterObj(obj, allowedfields) {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedfields.includes(el.toLowerCase())) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
}
function restrictTo(allowedRole) {
  return function (req, res, next) {
    const userRoles = req.user.roles;
    if (!userRoles.includes(allowedRole)) {
      return next(createHttpError.Forbidden('شما نمیتوانید به این قسمت دسترسی داشته باشید'));
    }
    next();
  };
}
module.exports = {
  randomTokenGenerator,
  signAccessToken,
  verifyRefreshToken,
  signRefreshToken,
  verifyToken,
  filterObj,
  restrictTo
};
