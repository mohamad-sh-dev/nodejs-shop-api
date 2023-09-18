const createHttpError = require('http-errors');
const joi = require('joi');

exports.createUpdateBlogsSchema = joi.object({
  id: joi.string().pattern(/^[a-f0-9]{24}$/),
  title: joi
    .string()
    .min(3)
    .max(20)
    .required()
    .messages({
      'string.min': '"عنوان" وبلاگ کوتاه تر از حد مجاز است (حداقل 3 کاراکتر)',
      'string.max': '"عنوان" وبلاگ بیشتر از حد مجاز  است (حداکثر 20 کاراکتر)',
      'string.empty': '"عنوان" وبلاگ نمیتواند خالی باشد',
      'any.required': '"عنوان" وبلاگ مورد نیاز میباشد'
  }),
  summary: joi
    .string()
    .min(7)
    .messages({
      'string.empty': '"توضیحات کوتاه" وبلاگ نمیتواند خالی باشد',
      'string.min': '"توصیحات کوتاه" وبلاگ کوتاه تر از حد مجاز است (حداقل 3 کاراکتر)',
      'any.required': '"توصیحات کوتاه" وبلاگ مورد نیاز میباشد'
  }),
  body: joi
    .string()
    .min(10)
    .required()
    .messages({
      'string.empty': '"متن " وبلاگ نمیتواند خالی باشد',
      'string.min': '"متن " وبلاگ کوتاه تر از حد مجاز است (حداقل 10 کاراکتر)',
      'any.required': '"متن " وبلاگ مورد نیاز میباشد'
  }),
  tag: joi
    .array()
    .items(/^#[A-Za-z0-9_\u0600-\u06FF]+$/)
    .error(createHttpError.BadRequest(' برچسب پست صحیح نمیباشد')),
  category: joi
    .string()
    .pattern(/^[a-f0-9]{24}$/)
    .required()
    .messages({
        'string.base': '"شناسه" دسته بندی وبلاگ باید از نوع رشته باشد',
        'string.empty': '"شناسه" دسته بندی وبلاگ نمیتواند خالی باشد',
        'string.pattern.base': 'فرمت شناسه وارد شده صحیح نمیباشد',
        'any.required': '"دسته بندی" وبلاگ مورد نیاز میباشد'
    }),
  image: joi
  .string()
  .pattern(/(\.jpg|\.png|\.jpeg)$/).allow(''),
  uploadedFilePath: joi
  .string()
});
exports.getDeleteBlogsSchema = joi.object({
  id: joi.string().pattern(/^[a-f0-9]{24}$/).error(createHttpError.BadRequest('')).required()
});
