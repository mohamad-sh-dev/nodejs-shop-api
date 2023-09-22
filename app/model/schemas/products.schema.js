const createHttpError = require('http-errors');
const joi = require('joi');
const { messageCenter } = require('../../utilities/messages');

exports.createUpdateProductSchema = joi.object({
    id: joi.string().pattern(/^[a-f0-9]{24}$/),
    summary: joi
        .string()
        .min(7)
        .max(30)
        .required()
        .messages({
            'string.empty': '"توضیحات کوتاه" نمیتواند خالی باشد',
            'string.min': '"توضیحات کوتاه" کمتر از حد مجاز است (حداقل 3 کاراکتر)',
            'string.max': '"توضیحات کوتاه" بیشتر از حد مجاز  است (حداکثر 15 کاراکتر)',
            'any.required': '"توضیحات کوتاه" مورد نیاز میباشد'
        }),
    tags: joi
        .array()
        .items(/^#[A-Za-z0-9_\u0600-\u06FF]+$/)
        .error(createHttpError.BadRequest('برچسب محصول صحیح نمیباشد')),
    category: joi
        .string()
        .pattern(/^[a-f0-9]{24}$/)
        .required()
        .messages({
            'string.base': '"شناسه" دسته بندی باید از نوع رشته باشد',
            'string.empty': '"شناسه" دسته بندی نمیتواند خالی باشد',
            'string.pattern.base': 'فرمت شناسه وارد شده صحیح نمیباشد',
            'any.required': '"دسته بندی" مورد نیاز میباشد'
        }),
    type: joi
        .string()
        .required()
        .valid('virtual', 'phicycal')
        .messages({
            'any.only': 'باشد virtual یا phicycal "نوع" محصول باید یکی از دو نوع',
            'any.required': '"نوع" محصول مورد نیاز میباشد',
            'string.base': '"نوع" دسته بندی محصول باید از نوع رشته باشد',
        }),
    price: joi
        .number()
        .required()
        .messages({
            'number.base': '"قیمت" محصول باید از نوع عدد باشد',
            'any.required': '"قیمت" محصول مورد نیاز میباشد',
        }),
    discount: joi
        .number(),
    images: joi
        .alternatives().try(joi.string(), joi.array()).allow(''),
    imageCover: joi
        .string().allow(''),
    uploadedFilePath: joi
        .string(),
    properties: joi
        .object({
            length: joi.number().allow(null).example(0).error(createHttpError.BadRequest('جزییات (طول) محصول صحیح نمیباشد')),
            height: joi.number().allow(null).example(0).error(createHttpError.BadRequest('جزییات (ارتفاع) محصول صحیح نمیباشد')),
            width: joi.number().allow(null).example(0).error(createHttpError.BadRequest('جزییات (عرض) محصول صحیح نمیباشد')),
            weight: joi.number().allow(null).example(0).error(createHttpError.BadRequest('جزییات (وزن) محصول صحیح نمیباشد')),
            colors: joi.string(),
            model: joi.string(),
            madein: joi.string(),
        })
});
exports.updateProductSchema = joi.object({
    productId: joi
        .string()
        .pattern(/^[a-f0-9]{24}$/)
        .required()
        .error(new Error(messageCenter.product.incorrectId)),
    title: joi
        .string()
        .min(3)
        .max(15)
        .allow('')
        .error(new Error('عنوان محصول مورد نیاز میباشد')),
    summary: joi
        .string()
        .min(7)
        .allow('')
        .error(createHttpError.BadRequest('توضیحات کوتاه محصول کافی نیست')),
    description: joi
        .string()
        .min(10)
        .allow('')
        .error(createHttpError.BadRequest('توضیحات محصول کافی نیست')),
    tags: joi
        .array()
        .error(createHttpError.BadRequest('برچسب محصول صحیح نمیباشد')),
    category: joi.string().allow('').pattern(/^[a-f0-9]{24}$/).error(createHttpError.BadRequest('دسته بندی محصول صحیح نمیباشد')),
    type: joi.string().allow('').valid('virtual', 'phicycal').error(createHttpError.BadRequest('نوع محصول را وارد کنید')),
    price: joi.number().allow('').error(createHttpError.BadRequest('قیمت محصول را وارد کنید')),
    discount: joi.number().allow('').error(createHttpError.BadRequest('تخفیف محصول صحیح نیست')),
    images: joi.array().allow(''),
    imageCover: joi.string().allow(''),
    uploadedFilePath: joi.string(),
    properties: joi.object({
        length: joi.number().allow(null).example(0).error(createHttpError.BadRequest('جزییات (طول) محصول صحیح نمیباشد')),
        height: joi.number().allow(null).example(0).error(createHttpError.BadRequest('جزییات (ارتفاع) محصول صحیح نمیباشد')),
        width: joi.number().allow(null).example(0).error(createHttpError.BadRequest('جزییات (عرض) محصول صحیح نمیباشد')),
        weight: joi.number().allow(null).example(0).error(createHttpError.BadRequest('جزییات (وزن) محصول صحیح نمیباشد')),
        colors: joi.string(),
        model: joi.string(),
        madein: joi.string(),
    })
});
exports.getDeleteProductSchema = joi.object({
    productId: joi.string().pattern(/^[a-f0-9]{24}$/).error(createHttpError.BadRequest('')).required()
});
