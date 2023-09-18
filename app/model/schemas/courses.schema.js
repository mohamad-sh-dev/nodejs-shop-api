const createHttpError = require('http-errors');
const joi = require('joi');
const { messageCenter } = require('../../utilities/messages');

exports.createUpdateCoursesSchema = joi.object({
    id: joi.string().pattern(/^[a-f0-9]{24}$/),
    title: joi
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
    summary: joi
        .string()
        .min(7)
        .max(40)
        .required()
        .messages({
            'string.empty': '"توضیحات کوتاه" نمیتواند خالی باشد',
            'string.min': '"توضیحات کوتاه" کمتر از حد مجاز است (حداقل 3 کاراکتر)',
            'string.max': '"توضیحات کوتاه" بیشتر از حد مجاز  است (حداکثر 40 کاراکتر)',
            'any.required': '"توضیحات کوتاه" مورد نیاز میباشد'
        }),
    description: joi
        .string()
        .min(10)
        .max(150)
        .messages({
            'string.empty': '"توضیحات کامل" نمیتواند خالی باشد',
            'string.min': '"توضیحات کامل" کمتر از حد مجاز است (حداقل 3 کاراکتر)',
            'string.max': '"توضیحات کامل"  بیشتر از حد مجاز  است (حداکثر 15 کاراکتر)',
            'any.required': '"توضیحات کامل" مورد نیاز میباشد'
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
        .valid('free', 'cash', 'vip')
        .messages({
            'any.only': 'باشد cash یا vip یا free "نوع" محصول باید یکی از دو نوع',
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
        .number()
        .messages({
            'number.base': '"تخفیف" قیمت محصول باید از نوع عدد باشد',
        }),
    imageCover: joi
        .string().allow(''),
    uploadedFilePath: joi
        .string()
});
exports.updateCoursesSchema = joi.object({
    couseId: joi
        .string()
        .pattern(/^[a-f0-9]{24}$/)
        .required()
        .error(new Error(messageCenter.public.incorrectId)),
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
    type: joi.string().allow('').valid('free', 'cash', 'vip').error(createHttpError.BadRequest('نوع محصول را وارد کنید')),
    price: joi.number().allow('').error(createHttpError.BadRequest('قیمت محصول را وارد کنید')),
    discount: joi.number().allow('').error(createHttpError.BadRequest('تخفیف محصول صحیح نیست')),
    imageCover: joi.string().allow(''),
    uploadedFilePath: joi.string(),
});
exports.getDeleteCoursesSchema = joi.object({
    courseId: joi.string().pattern(/^[a-f0-9]{24}$/).required()
        .messages({
            'string.base': '"شناسه" دوره باید از نوع رشته باشد',
            'string.empty': '"شناسه" دوره نمیتواند خالی باشد',
            'string.pattern.base': 'فرمت شناسه وارد شده صحیح نمیباشد',
            'any.required': '"شناسه" دوره مورد نیاز میباشد'
        }),
});
