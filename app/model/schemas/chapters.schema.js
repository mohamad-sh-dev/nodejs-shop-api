const joi = require('joi');
const { messageCenter } = require('../../utilities/messages');

exports.createUpdateChaptersSchema = joi.object({
    courseId: joi
        .string()
        .pattern(/^[a-f0-9]{24}$/),
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
    description: joi
        .string()
        .min(10)
        .max(150)
        .messages({
            'string.empty': '"توضیحات کامل" نمیتواند خالی باشد',
            'string.min': '"توضیحات کامل" کمتر از حد مجاز است (حداقل 3 کاراکتر)',
            'string.max': '"توضیحات کامل"  بیشتر از حد مجاز  است (حداکثر 15 کاراکتر)',
            'any.required': '"توضیحات کامل" مورد نیاز میباشد'
        })
});
exports.updateChaptersSchema = joi.object({
    chapterId: joi
        .string()
        .pattern(/^[a-f0-9]{24}$/)
        .required()
        .error(new Error(messageCenter.public.incorrectId)),
    title: joi
        .string()
        .min(3)
        .max(40)
        .required()
        .messages({
            'string.min': '"عنوان" کوتاه تر از حد مجاز است (حداقل 3 کاراکتر)',
            'string.max': '"عنوان" بیشتر از حد مجاز  است (حداکثر 15 کاراکتر)',
            'string.empty': '"عنوان" نمیتواند خالی باشد',
            'any.required': '"عنوان" مورد نیاز میباشد'
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
});

exports.getDeleteChaptersSchema = joi.object({
    chapterId: joi
        .string()
        .pattern(/^[a-f0-9]{24}$/)
        .required()
        .messages({
            'string.base': '"شناسه" فصل باید از نوع رشته باشد',
            'string.empty': '"شناسه" فصل نمیتواند خالی باشد',
            'string.pattern.base': 'فرمت شناسه وارد شده صحیح نمیباشد',
            'any.required': '"شناسه" فصل مورد نیاز میباشد'
        }),
});
