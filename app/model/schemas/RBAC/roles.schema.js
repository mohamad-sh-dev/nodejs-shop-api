const createHttpError = require('http-errors');
const joi = require('joi');
const { MONGO_ID_PATTERN } = require('../../../utilities/constants');

exports.createRoleSchema = joi.object({
    name: joi
        .string()
        .required()
        .messages({
            'string.empty': '"عنوان" نقش نمیتواند خالی باشد',
            'any.required': '"عنوان" نقش مورد نیاز میباشد'
        }),
    description: joi
        .string()
        .required()
        .messages({
            'string.empty': '"توضیحات کامل" نمیتواند خالی باشد',
            'any.required': '"توضیحات کامل" مورد نیاز میباشد'
        }),
    permissions: joi
        .array()
        .items(
            joi.string()
                .pattern(MONGO_ID_PATTERN)
        )
});
exports.updateRolesSchema = joi.object({
    roleID: joi
        .string()
        .required()
        .pattern(MONGO_ID_PATTERN),
    name: joi
        .string()
        .allow(''),
    description: joi
        .string()
        .allow(''),
    permissions: joi
        .array()
        .items(
            joi.string()
                .pattern(MONGO_ID_PATTERN)
        )
});
exports.deleteRoleSchema = joi.object({
    roleID: joi
        .string()
        .required()
        .pattern(MONGO_ID_PATTERN),
    name: joi
        .string()
        .allow(''),
});
