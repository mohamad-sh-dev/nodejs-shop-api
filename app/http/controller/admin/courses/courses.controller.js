/* eslint-disable no-prototype-builtins */
const { StatusCodes: httpStatusCodes } = require('http-status-codes');
const createHttpError = require('http-errors');
const { CourseModel } = require('../../../../model/courses');
const { messageCenter } = require('../../../../utilities/messages');
const BaseController = require('../../baseController');
const { sendResponseToClient, assignUploadPathToImages } = require('../../../../utilities/functions');
const unlinkFile = require('../../../../utilities/unlinkFile');

class CourseController extends BaseController {
    async getListofCourses(req, res, next) {
        try {
            const courses = await CourseModel.find();
            return sendResponseToClient(res, messageCenter.public.success, httpStatusCodes.OK, courses);
        } catch (error) {
            next(error);
        }
    }

    async createCourse(req, res, next) {
        try {
            const {
                title, summary, description, tags, type, category, price, discount
            } = req.body;
            let imageCover;
            if (Object.keys(req.file).length > 1) {
                imageCover = req.file.uploadedPath;
            }
            const createdCourse = await CourseModel.create({
                title,
                summary,
                description,
                tags,
                type,
                category,
                price,
                discount,
                teacher: req.user.id,
                imageCover
            });

            return sendResponseToClient(res, messageCenter.public.success, httpStatusCodes.CREATED, createdCourse);
        } catch (error) {
            next(error);
        }
    }

    async updateCourse(req, res, next) {
        try {
            const { courseId } = req.body;
            const course = await CourseModel.findOne({ _id: courseId });
            if (Object.keys(req.files).length > 1) {
                const { imageCover } = assignUploadPathToImages(req.files);
                req.body.imageCover = imageCover;
            }
            Object.keys(course).forEach((key) => {
                if (Array.isArray(course[key]) && req.body.hasOwnProperty(key)) {
                    req.body[key] = course[key].concat(req.body[key]);
                }
            });
            const courseUpdatedrersult = await CourseModel.updateOne({ _id: courseId }, {
                $set: req.body
            });
            if (!courseUpdatedrersult.modifiedCount) {
                throw createHttpError.InternalServerError(messageCenter.course.failedUpdate);
            }
            return res.status(httpStatusCodes.OK).json({
                status: messageCenter.public.success,
                message: messageCenter.public.successUpdate
            });
        } catch (error) {
            next(error);
        }
    }

    async removeCourse(req, res, next) {
        try {
            const { courseId } = req.body;
            const { data: course } = await this.checkExistCourse(courseId);

            const removeCourseImagesFromServer = unlinkFile([course?.imageCover]);
            const removeCourseAction = CourseModel.deleteOne({ _id: courseId });

            const removeContentResult = await Promise.all([removeCourseImagesFromServer, removeCourseAction]);
            removeContentResult.forEach((removeResult) => { // TODO: fix this unlink function result that undefined !!!
                if (removeResult?.status === 'rejected') {
                    throw createHttpError.InternalServerError(new Error(messageCenter.course.removeFaild));
                }
            });

            return res.status(httpStatusCodes.OK).json({
                message: messageCenter.public.removeSuccessfull
            });
        } catch (error) {
            next(error);
        }
    }

    async checkExistCourse(id) {
        const course = await CourseModel.findOne({ _id: id });
        if (!course) throw createHttpError.NotFound('دوره مورد نظر مورد نظر یافت نشد');
        return {
            exist: !!course,
            data: course,
        };
    }

    async findCourseById(req, res, next) {
        try {
            const { courseId } = req.params;
            const course = await CourseModel.findById(courseId);
            if (!course) throw createHttpError.NotFound(messageCenter.public.notFoundContent);
            return sendResponseToClient(res, messageCenter.public.success, httpStatusCodes.OK, course);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new CourseController();
