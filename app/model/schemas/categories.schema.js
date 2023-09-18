const createHttpError = require('http-errors');
const joi = require('joi');

exports.createUpdateCategorySchema = joi.object({
  name: joi
    .string()
    .min(3)
    .max(20)
    .required()
    .messages({
      'string.min': '"عنوان" کوتاه تر از حد مجاز است (حداقل 3 کاراکتر)',
      'string.max': '"عنوان" بیشتر از حد مجاز  است (حداکثر 20 کاراکتر)',
      'string.empty': '"عنوان" نمیتواند خالی باشد',
      'any.required': '"عنوان" مورد نیاز میباشد'
  }),
  parentCategory: joi
    .string()
    .pattern(/^[a-f0-9]{24}$/)
    .messages({
      'string.base': '"شناسه" دسته بندی باید از نوع رشته باشد',
      'string.empty': '"شناسه" دسته بندی نمیتواند خالی باشد',
      'string.pattern.base': 'فرمت شناسه وارد شده صحیح نمیباشد',
      'any.required': '"دسته بندی" مورد نیاز میباشد'
  }),
  subCategory: joi
  .array()
  .items(/^[a-f0-9]{24}$/)
  .allow()
  .error(createHttpError.BadRequest('شناسه فرزند صحیح نمیباشد')),
});
exports.getDeleteCategorySchema = joi.object({
  name: joi
    .string()
    .min(3)
    .max(10)
    .error(createHttpError.BadRequest('نام دسته بندی صحیح نیست')),
  categoryId: joi
  .string()
  .pattern(/^[a-f0-9]{24}$/)
  .error(createHttpError.BadRequest('شناسه دسته بندی صحیح نمیباشد'))
  .required()
});
