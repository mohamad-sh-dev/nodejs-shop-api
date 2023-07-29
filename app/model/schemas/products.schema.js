const createHttpError = require('http-errors');
const joi = require('joi');

exports.createUpdateProductSchema = joi.object({
    id: joi.string().pattern(/^[a-f0-9]{24}$/),
    title: joi
        .string()
        .min(3)
        .max(15)
        .required()
        .error(new Error('عنوان محصول مورد نیاز میباشد')),
    summary: joi
        .string()
        .min(7)
        .error(createHttpError.BadRequest('توضیحات کوتاه محصول کافی نیست')),
    description: joi
        .string()
        .min(10)
        .error(createHttpError.BadRequest('توضیحات محصول کافی نیست')),
    tag: joi
        .array()
        .items(/^#[A-Za-z0-9_]+$/)
        .error(createHttpError.BadRequest('برچسب محصول صحیح نمیباشد')),
    category: joi.string().pattern(/^[a-f0-9]{24}$/).required().error(createHttpError.BadRequest('دسته بندی محصول صحیح نمیباشد')),
    type: joi.string().required().valid('virtual', 'phicycal').error(createHttpError.BadRequest('نوع محصول را وارد کنید')),
    price: joi.number().required().error(createHttpError.BadRequest('قیمت محصول را وارد کنید')),
    discount: joi.number().error(createHttpError.BadRequest('تخفیف محصول صحیح نیست')),
    images: joi.array(),
    imageCover: joi.string(),
    uploadedFilePath: joi.string(),
    properties: joi.object({
        length: joi.number().allow(null).example(0).error(createHttpError.BadRequest('جزییات (طول) محصول صحیح نمیباشد')),
        height: joi.number().allow(null).example(0).error(createHttpError.BadRequest('جزییات (ارتفاع) محصول صحیح نمیباشد')),
        width: joi.number().allow(null).example(0).error(createHttpError.BadRequest('جزییات (عرض) محصول صحیح نمیباشد')),
        weight: joi.number().allow(null).example(0).error(createHttpError.BadRequest('جزییات (وزن) محصول صحیح نمیباشد')),
        colors: joi.number(),
        model: joi.number(),
        madein: joi.number(),
    })
});
exports.getDeleteProductSchema = joi.object({
    id: joi.string().pattern(/^[a-f0-9]{24}$/).error(createHttpError.BadRequest('')).required()
});
