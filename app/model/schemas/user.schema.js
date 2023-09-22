const joi = require('joi');
const { PASSWORD_PATTERN } = require('../../utilities/constants');

exports.updateProfileSchema = joi.object({
    firstName: joi
        .string()
        .min(2)
        .max(15)
        .messages({
            'string.empty': '"نام" نمیتواند خالی باشد',
            'string.min': '"نام" کمتر از حد مجاز است (حداقل 2 کاراکتر)',
            'string.max': '"نام" بیشتر از حد مجاز  است (حداکثر 15 کاراکتر)',
        }),
    lastName: joi
        .string()
        .min(3)
        .max(20)
        .messages({
            'string.min': '"نام خانوادگی" کمتر از حد مجاز است (حداقل 3 کاراکتر)',
            'string.max': '"نام خانوادگی" بیشتر از حد مجاز  است (حداکثر 15 کاراکتر)',
        }),
    password: joi
        .string()
        .pattern(PASSWORD_PATTERN)
        .messages({
            'string.pattern.base': 'فرمت پسوورد وارد شده صحیح نمیباشد',
        }),
    profileImage: joi
        .string()
        .allow(''),
    birthDate: joi
        .string()
});
