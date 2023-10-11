/* eslint-disable no-prototype-builtins */
const createHttpError = require('http-errors');
const JWT = require('jsonwebtoken');
const path = require('path');
const fsPromises = require('fs').promises;
const redisCilent = require('./initRedis');
const { UserModel } = require('../model/user');
const { publicDefinitions } = require('./publicDefinitions');
const { messageCenter } = require('./messages');

function randomTokenGenerator() {
  return Math.floor((Math.random() * 10000) * 10);
}

function signAccessToken(user) {
  return new Promise((resolve, reject) => {
    try {
      const payload = {
        mobile: user.mobile,
      };
      const options = {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRE
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
        expiresIn: process.env.REFRESH_TOKEN_EXPIRE
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
          if (err) reject(createHttpError.BadRequest(messageCenter.AUTHENTICATION.INVALID_TOKEN));
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
          if (err) reject(createHttpError.BadRequest(messageCenter.AUTHENTICATION.INVALID_TOKEN));
          const { mobile } = tokenPayload || {};
          const user = await UserModel.findOne({ mobile }, { password: 0, otp: 0 });
          const userRefreshTokne = await redisCilent.get(user.id);
          if (userRefreshTokne === token) resolve(mobile);
          else reject(createHttpError.Unauthorized(messageCenter.AUTHENTICATION.INVALID_TOKEN));
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
    if (allowedfields.includes(el)) {
      const nulishData = publicDefinitions.nullishData();
      if (!nulishData.includes(obj[el])) {
        newObj[el] = obj[el];
      }
    }
  });
  return newObj;
}
function mergeExistContentWithFilteredBody(existContent, newBody) {
  const copyOfNewBody = JSON.parse(JSON.stringify(newBody));
  Object.keys(existContent).forEach((key) => {
    if (Array.isArray(existContent[key]) && copyOfNewBody.hasOwnProperty(key)) {
      copyOfNewBody[key] = existContent[key].concat(copyOfNewBody[key]);
    } else if (typeof existContent[key] === 'object' && copyOfNewBody.hasOwnProperty(key)) {
      copyOfNewBody[key] = Object.assign(existContent[key], copyOfNewBody[key]);
    }
  });
  return copyOfNewBody;
}
function assignUploadPathToImages(files) {
  let { images, imageCover } = files;
  images = images.map((imageObject) => imageObject.uploadedPath);
  imageCover = imageCover[0].uploadedPath;
  return { images, imageCover };
}
async function makeUploadDestination(entity) {
  const date = new Date();
  const year = date.getFullYear().toString();
  const month = date.getMonth().toString();
  const day = date.getDay().toString();
  const dirPath = path.join(__dirname, '..', '..', 'public', 'uploads', entity);
  const finalDirectoryPath = path.join(dirPath, year, month, day);
  await fsPromises.mkdir(finalDirectoryPath, { recursive: true });
  return finalDirectoryPath;
}
function sendResponseToClient(response, status, statusCode, data, message) {
  let dataCount = 0;
  if (data) {
    dataCount = Array.isArray(data) ? data?.length : 1;
  }
  return response.status(statusCode).json({
    status: status || '',
    message: message || '',
    count: dataCount,
    data: data || []
  });
}

async function setHostUrl(req, entity) {
  const directoryPath = path.join(__dirname, '..', '..', 'public', 'uploads', entity);
  await fsPromises.mkdir(directoryPath, { recursive: true });
  console.log(directoryPath);
  return `${req.protocol}://${req.get('host')}/uploads/${entity}`;
}
module.exports = {
  sendResponseToClient,
  randomTokenGenerator,
  signAccessToken,
  verifyRefreshToken,
  signRefreshToken,
  verifyToken,
  filterObj,
  makeUploadDestination,
  mergeExistContentWithFilteredBody,
  assignUploadPathToImages,
  setHostUrl
};
