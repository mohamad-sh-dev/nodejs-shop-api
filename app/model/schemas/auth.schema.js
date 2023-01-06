const joi = require("joi");

exports.getOtpSchema = joi.object({
  mobile: joi
    .string()
    .length(11)
    .pattern(/^09[0-9]{9}/)
    .required()
    .error(new Error("شماره همراه صحیح نیست")),
});
exports.checkOtpSchema = joi.object({
  mobile: joi
    .string()
    .length(11)
    .pattern(/^09[0-9]{9}/)
    .required()
    .error(new Error("شماره همراه صحیح نیست")),
  code: joi
    .string()
    .min(4)
    .max(6)
    .required()
    .error(new Error("کد اعتبار سنجی صحیح نیست")),
});
exports.refreshTokenSchema = joi.object({
  refreshToken: joi
    .string()
    .error(new Error("توکن نامعتبر"))
});
