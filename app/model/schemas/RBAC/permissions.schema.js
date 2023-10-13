const joi = require('joi');
const { messageCenter } = require('../../../utilities/messages');

exports.createPermissionSchema = joi.object({
  title: joi
    .string()
    .pattern(/^\/[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)?$/)
    .required()
    .messages({
      'string.empty': '"عنوان" دسترسی نمیتواند خالی باشد',
      'any.required': '"عنوان" دسترسی مورد نیاز میباشد',
      'string.pattern.base': 'فرمت عنوان وارد شده صحیح نمیباشد',
    }),
  methods: joi
    .array()
    .items(joi.string().valid('DELETE', 'GET', 'POST', 'PUT', 'PATCH', 'OPTIONS'))
    .required()
    .messages({
      'string.empty': '"متود" دسترسی نمیتواند خالی باشد',
      'any.required': '"متود" دسترسی مورد نیاز میباشد',
      'any.only': '"نوع" متود باید یکی از انواع مشخص شده باشد',

    }),
  description: joi
    .string()
    .required()
    .messages({
      'string.empty': '"توضیحات کامل" نمیتواند خالی باشد',
      'any.required': '"توضیحات کامل" مورد نیاز میباشد'
    })
});
exports.updatePermissionSchema = joi.object({
  permissionID: joi
    .string()
    .pattern(/^[a-f0-9]{24}$/)
    .required()
    .error(new Error(messageCenter.product.incorrectId)),
  title: joi
    .string()
    .pattern(/^\/[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)?$/)
    .allow('')
    .messages({
      'string.pattern.base': 'فرمت عنوان وارد شده صحیح نمیباشد',
    }),
  methods: joi
    .array()
    .items(joi.string().valid('DELETE', 'GET', 'POST', 'PUT', 'PATCH', 'OPTIONS'))
    .messages({
      'string.empty': '"متود" دسترسی نمیتواند خالی باشد',
      'any.only': '"نوع" متود باید یکی از انواع مشخص شده باشد',

    }),
  description: joi
    .string()
    .allow('')
    .messages({
      'string.empty': '"توضیحات کامل" نمیتواند خالی باشد',
    })
});
exports.getDeletePermissionsSchema = joi.object({
  permissionID: joi
    .string()
    .pattern(/^[a-f0-9]{24}$/)
    .required()
    .error(new Error(messageCenter.product.incorrectId)),
});
