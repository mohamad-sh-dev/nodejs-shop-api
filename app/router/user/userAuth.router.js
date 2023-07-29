const { Router } = require('express');
const userAuthController = require('../../http/controller/user/userAuth.controller');
const { validateRequestBody } = require('../../http/validations/auth.schema');
const { getOtpSchema, checkOtpSchema, refreshTokenSchema } = require('../../model/schemas/auth.schema');

const router = new Router();

router.post('/getOtp', validateRequestBody(getOtpSchema), userAuthController.getOtp);

router.post('/checkOtp', validateRequestBody(checkOtpSchema), userAuthController.checkOtp);

router.post('/refreshToken', validateRequestBody(refreshTokenSchema), userAuthController.refreshToken);

module.exports = {
  userAuthentication: router,
};
