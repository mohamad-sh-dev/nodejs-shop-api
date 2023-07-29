const createHttpError = require('http-errors');
const BaseController = require('../baseController');
const { UserModel } = require('../../../model/user');
const {
  randomTokenGenerator,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require('../../../utilities/functions');

class UserAuthController extends BaseController {
  async getOtp(req, res, next) {
    try {
      const token = randomTokenGenerator();
      const { mobile } = req.body;
      const result = await this.saveUser(mobile, token);
      if (!result) throw createHttpError.BadGateway('ورود شما انجام نشد');
      return res.status(200).json({
        status: 'success',
        message: 'توکن ارسال شد',
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
      if (!user) throw createHttpError.NotFound('کاربر یافت نشد');
      if (user && user.otp.token.toString() !== code) { throw createHttpError.Unauthorized('کد اعتبار سنجی صحیح نیست'); }
      const now = Date.now();
      if (user.otp.expiresIn < now) { throw createHttpError.Unauthorized('کد شما منقضی شده است'); }
      const accessToken = await signAccessToken(user);
      const refreshToken = await signRefreshToken(user);
      return res.status(200).json({
        status: 'success',
        accessToken,
        refreshToken,
      });
    } catch (error) {
      next(error);
    }
  }

  async saveUser(mobile, token) {
    const otp = {
      token,
      expiresIn: Date.now() + 120000
    };
    const user = await this.checkExistUser(mobile);
    if (user) {
      return this.updateUser(mobile, otp);
    }
    return UserModel.create({
      mobile,
      otp,
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
module.exports = new UserAuthController();
