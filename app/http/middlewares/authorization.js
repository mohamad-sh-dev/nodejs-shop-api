const createHttpError = require("http-errors");
const { UserModel } = require("../../model/user");
const { verifyToken } = require("../../utilities/functions");
exports.isAuthenticated = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      throw createHttpError.Unauthorized("وارد حساب کاربری خود شوید");
    }

    const decodedToken = await verifyToken(token);
    const user = await UserModel.findOne(
      { mobile: decodedToken.mobile },
      { password: 0, roles: 0, otp: 0 }
    );
    if (!user) throw createHttpError.NotFound("کاربر یافت نشد");
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
