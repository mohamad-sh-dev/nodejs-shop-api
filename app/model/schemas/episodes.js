const joi = require('joi');
const { messageCenter } = require('../../utilities/messages');

exports.createUpdateEpisodesSchema = joi.object({
    title: joi
        .string()
        .min(3)
        .max(40)
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
        }),
    type: joi
        .string()
        .required()
        .valid('lock', 'unlock')
        .messages({
            'any.only': 'باشد unlock یا lock "نوع" محصول باید یکی از دو نوع',
            'any.required': '"نوع" محصول مورد نیاز میباشد',
            'string.base': '"نوع" قسمت قسمت باید از نوع رشته باشد',
        }),
    chapterId: joi
        .string()
        .pattern(/^[a-f0-9]{24}$/)
        .required()
        .messages({
            'string.base': '"شناسه" فصل باید از نوع رشته باشد',
            'string.empty': '"شناسه" فصل نمیتواند خالی باشد',
            'string.pattern.base': 'فرمت شناسه وارد شده صحیح نمیباشد',
            'any.required': '"فصل" مورد نیاز میباشد'
        }),
    uploadedFilePath: joi
        .string(),
    video: joi
        .string()
        .messages({
            'string.empty': '"ویدیو" قسمت نمیتواند خالی باشد'
        })
});
exports.updateEpisodesSchema = joi.object({
    episodeId: joi
        .string()
        .pattern(/^[a-f0-9]{24}$/)
        .required()
        .error(new Error(messageCenter.public.incorrectId)),
    title: joi
        .string()
        .min(3)
        .max(20)
        .allow('')
        .messages({
            'string.min': '"عنوان" کوتاه تر از حد مجاز است (حداقل 3 کاراکتر)',
            'string.max': '"عنوان" بیشتر از حد مجاز  است (حداکثر 20 کاراکتر)'
        }),
    description: joi
        .string()
        .min(10)
        .max(150)
        .allow('')
        .messages({
            'string.min': '"توضیحات کامل" کمتر از حد مجاز است (حداقل 3 کاراکتر)',
            'string.max': '"توضیحات کامل"  بیشتر از حد مجاز  است (حداکثر 15 کاراکتر)',
        }),
    type: joi
        .string()
        .valid('lock', 'unlock')
        .allow('')
        .messages({
            'any.only': 'باشد unlock یا lock "نوع" محصول باید یکی از دو نوع',
            'string.base': '"نوع" دسته بندی قسمت باید از نوع رشته باشد',
        }),
    uploadedFilePath: joi
        .string(),
    video: joi
        .string()
        .allow('')
});
exports.getDeleteEpisodesSchema = joi.object({
    episodeId: joi.string().pattern(/^[a-f0-9]{24}$/).required()
        .messages({
            'string.base': '"شناسه" قسمت باید از نوع رشته باشد',
            'string.empty': '"شناسه" قسمت نمیتواند خالی باشد',
            'string.pattern.base': 'فرمت شناسه وارد شده صحیح نمیباشد',
            'any.required': '"شناسه" قسمت مورد نیاز میباشد'
        }),
});
exports.getEpisodesOfChapterSchema = joi.object({
    chapterId: joi.string().pattern(/^[a-f0-9]{24}$/).required()
        .messages({
            'string.base': '"شناسه" فصل باید از نوع رشته باشد',
            'string.empty': '"شناسه" فصل نمیتواند خالی باشد',
            'string.pattern.base': 'فرمت شناسه وارد شده صحیح نمیباشد',
            'any.required': '"شناسه" فصل مورد نیاز میباشد'
        }),
});
