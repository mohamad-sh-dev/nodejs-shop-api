const createHttpError = require('http-errors');
const { StatusCodes: httpStatusCodes } = require('http-status-codes');
const BaseController = require('../baseController');
const { UserModel } = require('../../../model/user');
const {
  randomTokenGenerator,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  setHostUrl,
} = require('../../../utilities/functions');
const { messageCenter } = require('../../../utilities/messages');
const { UPLOADS_ENTITIES, USER_PROFILE_IAMGE_DEFAULT_STRING } = require('../../../utilities/constants');

class UserAuthController extends BaseController {
  async getOtp(req, res, next) {
    try {
      const token = randomTokenGenerator();
      const result = await this.saveUser(req, token);
      if (!result) throw createHttpError.BadGateway(messageCenter.AUTHENTICATION.FAILED_LOGIN);
      return res.status(200).json({
        status: messageCenter.public.success,
        message: messageCenter.AUTHENTICATION.TOKEN_SENT,
        token,
      });
    } catch (error) {
      next(error);
    }
  }

  async checkOtp(req, res, next) {
    try {
      const { mobile, code } = req.body;
      const user = await UserModel.findOne({ mobile });
      if (!user) throw createHttpError.NotFound(messageCenter.USER.NOTFOUND);
      if (user && user.otp.token.toString() !== code) { throw createHttpError.Unauthorized(messageCenter.AUTHENTICATION.INCORRECT_TOKEN); }
      const now = Date.now();
      if (user.otp.expiresIn < now) { throw createHttpError.Unauthorized(messageCenter.AUTHENTICATION.EXPIRE_TOKEN); }
      const accessToken = await signAccessToken(user);
      const refreshToken = await signRefreshToken(user);
      return res.status(httpStatusCodes.OK).json({
        status: messageCenter.public.success,
        accessToken,
        refreshToken,
      });
    } catch (error) {
      next(error);
    }
  }

  async saveUser(req, token) {
    const otp = {
      token,
      expiresIn: Date.now() + 120000
    };
    const { mobile } = req.body;
    const user = await this.checkExistUser(mobile);
    if (user) {
      return this.updateUser(mobile, otp);
    }
    return UserModel.create({
      mobile,
      username: mobile,
      otp,
      profileImage: `${await setHostUrl(req, UPLOADS_ENTITIES.USER)}/${USER_PROFILE_IAMGE_DEFAULT_STRING}`
    });
  }

  async checkExistUser(mobile) {
    return !!(await UserModel.findOne({ mobile }));
  }

  async updateUser(mobile, otp) {
    const updatedUser = await UserModel.updateOne(
      { mobile },
      { $set: { otp } }
    );
    return !!updatedUser.modifiedCount;
  }

  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const mobile = await verifyRefreshToken(refreshToken);
      const user = await UserModel.findOne({ mobile }, { password: 0, otp: 0 });
      res.status(200).json({
        accessToken: await signAccessToken(user),
        refreshToken: await signRefreshToken(user),
      });
    } catch (error) {
      next(error);
    }
  }
}
module.exports = {
  UserAuthController: new UserAuthController()
};
