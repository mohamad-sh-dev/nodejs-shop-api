/* eslint-disable no-prototype-builtins */
const { StatusCodes: httpStatusCodes } = require('http-status-codes');
const createHttpError = require('http-errors');
const { CourseModel } = require('../../../../model/courses');
const { messageCenter } = require('../../../../utilities/messages');
const BaseController = require('../../baseController');
const { sendResponseToClient } = require('../../../../utilities/functions');
const coursesController = require('./courses.controller');
const { ChapterModel } = require('../../../../model/chapters');

class CourseController extends BaseController {
    async getChapter(req, res, next) {
        try {
            const { chapterId } = req.params;
            const chapter = await ChapterModel.findOne({
                _id: chapterId
            }, { __v: 0 }).populate({
                path: 'episodes',
                select: { chapterId: 0, __v: 0 }
            }).populate({
                path: 'courseId',
                select: {
                    title: 1,
                    summary: 1,
                    description: 1,
                    duration: 1
                }
            });

            return sendResponseToClient(res, messageCenter.public.success, httpStatusCodes.OK, chapter);
        } catch (error) {
            next(error);
        }
    }

    async createChapter(req, res, next) {
        try {
            const {
                title, description, courseId
            } = req.body;
            await coursesController.checkExistCourse(courseId);
            const createdChapter = await ChapterModel.create({ title, description, courseId });
            const updateCourseChapters = await CourseModel.updateOne({ _id: courseId }, {
                $push: {
                    chapters: createdChapter.id
                }
            });
            if (!updateCourseChapters.modifiedCount) throw createHttpError.InternalServerError(messageCenter.public.internalServerErrorMsg);
            return sendResponseToClient(res, messageCenter.public.success, httpStatusCodes.CREATED, createdChapter);
        } catch (error) {
            next(error);
        }
    }

    async updateChapter(req, res, next) {
        try {
            const { chapterId } = req.body;
            const chapter = await ChapterModel.findOne({ _id: chapterId });
            Object.keys(chapter).forEach((key) => {
                if (Array.isArray(chapter[key]) && req.body.hasOwnProperty(key)) {
                    req.body[key] = chapter[key].concat(req.body[key]);
                }
            });
            const chapterUpdatedRersult = await ChapterModel.updateOne({ _id: chapterId }, {
                $set: req.body
            });
            if (!chapterUpdatedRersult.modifiedCount) {
                throw createHttpError.InternalServerError(messageCenter.public.FAILED_UPDATE);
            }
            return res.status(httpStatusCodes.OK).json({
                status: messageCenter.public.success,
                message: messageCenter.public.successUpdate
            });
        } catch (error) {
            next(error);
        }
    }

    async removeChapter(req, res, next) {
        try {
            const { chapterId } = req.body;
            const { data: chapter } = await this.checkExistChapter(chapterId);

            const removeChapterAction = ChapterModel.deleteOne({ _id: chapterId });
            const removeChapterIdFromCourseChaptersArray = CourseModel.updateOne({ _id: chapter.courseId }, {
                $pull: {
                    chapters: chapterId
                }
            });

            const removeContentResult = await Promise.all([removeChapterAction, removeChapterIdFromCourseChaptersArray]);
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

    async checkExistChapter(id) {
        const chapter = await ChapterModel.findOne({ _id: id });
        if (!chapter) throw createHttpError.NotFound(messageCenter.public.notFoundContent);
        return {
            exist: !!chapter,
            data: chapter,
        };
    }

    async findChapterById(req, res, next) {
        try {
            const { chapterId } = req.params;
            const chapter = await ChapterModel.findById(chapterId);
            if (!chapter) throw createHttpError.NotFound(messageCenter.public.notFoundContent);
            return sendResponseToClient(res, messageCenter.public.success, httpStatusCodes.OK, chapter);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new CourseController();
