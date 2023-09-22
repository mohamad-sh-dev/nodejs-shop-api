const { Router } = require('express');
const { UserAuthController } = require('../../http/controller/user/auth.user.controller');
const { validateRequestBody } = require('../../http/validations/auth.schema');
const { getOtpSchema, checkOtpSchema, refreshTokenSchema } = require('../../model/schemas/auth.schema');

const router = new Router();

router.post('/getOtp', validateRequestBody(getOtpSchema), UserAuthController.getOtp);

router.post('/checkOtp', validateRequestBody(checkOtpSchema), UserAuthController.checkOtp);

router.post('/refreshToken', validateRequestBody(refreshTokenSchema), UserAuthController.refreshToken);

module.exports = {
  userAuthentication: router,
};
