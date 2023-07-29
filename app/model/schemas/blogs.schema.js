const createHttpError = require('http-errors');
const joi = require('joi');

exports.createUpdateBlogsSchema = joi.object({
  id: joi.string().pattern(/^[a-f0-9]{24}$/),
  title: joi
    .string()
    .min(3)
    .max(15)
    .required()
    .error(new Error('عنوان پست مورد نیاز میباشد')),
  summary: joi
    .string()
    .min(7)
    .error(createHttpError.BadRequest('توضیحات کافی نیست')),
  body: joi
    .string()
    .min(10)
    .error(createHttpError.BadRequest('متن پست کافی نیست')),
  tag: joi
    .array()
    .items(/^#[A-Za-z0-9_]+$/)
    .error(createHttpError.BadRequest(' برچسب پست صحیح نمیباشد')),
  category: joi.string().pattern(/^[a-f0-9]{24}$/),
  image: joi.string().pattern(/(\.jpg|\.png|\.jpeg)$/),
  uploadedFilePath: joi.string()
});
exports.getDeleteBlogsSchema = joi.object({
  id: joi.string().pattern(/^[a-f0-9]{24}$/).error(createHttpError.BadRequest('')).required()
});
