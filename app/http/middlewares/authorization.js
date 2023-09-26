/* eslint-disable prefer-destructuring */
const createHttpError = require('http-errors');
const { UserModel } = require('../../model/user');
const { verifyToken } = require('../../utilities/functions');
const { messageCenter } = require('../../utilities/messages');

exports.isAuthenticated = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization
      && req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      throw createHttpError.Unauthorized(messageCenter.USER.ACCOUNT_NOTFOUND);
    }

    const decodedToken = await verifyToken(token);
    const user = await UserModel.findOne(
      { mobile: decodedToken.mobile },
      { password: 0, otp: 0 }
    );
    if (!user) throw createHttpError.NotFound(messageCenter.USER.NOTFOUND);
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
exports.isAuthenticatedForGraphQL = async (req) => {
  let token;
  if (req.headers.authorization
    && req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    throw createHttpError.Unauthorized(messageCenter.USER.ACCOUNT_NOTFOUND);
  }
  const decodedToken = await verifyToken(token);
  const user = await UserModel.findOne(
    { mobile: decodedToken.mobile },
    { password: 0, otp: 0 }
  );
  if (!user) throw createHttpError.NotFound(messageCenter.USER.NOTFOUND);
  return user;
};
