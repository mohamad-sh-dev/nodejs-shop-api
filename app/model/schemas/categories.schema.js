const createHttpError = require("http-errors");
const joi = require("joi");

exports.createUpdateCategorySchema = joi.object({
  name: joi
    .string()
    .min(3)
    .max(10)
    .required()
    .error(new Error("نام دسته بندی صحیح نیست")),
  parentCategory: joi
    .string()
    .pattern(new RegExp(/^[a-f\\d]{24}$/))
    .error(createHttpError.BadRequest("شناسه معتبر نیست")),
  subCategory: joi.array().items(joi.string()).allow(),
});
exports.getDeleteCategorySchema = joi.object({
  name: joi
    .string()
    .min(3)
    .max(10)
    .error(createHttpError.BadRequest("نام دسته بندی صحیح نیست")),
  categoryId: joi.string().pattern(new RegExp(/^[a-f0-9]{24}$/)).error(createHttpError.BadRequest("شناسه معتبر نیست")).required()
});
