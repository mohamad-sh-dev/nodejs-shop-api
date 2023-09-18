/* eslint-disable no-underscore-dangle */
const { StatusCodes: httpStatusCodes } = require('http-status-codes');
const createHttpError = require('http-errors');
const mongoose = require('mongoose');
const { getVideoDurationInSeconds } = require('get-video-duration');
const { EpisodeModel } = require('../../../../model/episods');
const { messageCenter } = require('../../../../utilities/messages');
const BaseController = require('../../baseController');
const { sendResponseToClient, filterObj } = require('../../../../utilities/functions');
const unlinkFile = require('../../../../utilities/unlinkFile');
const { getVideoTime } = require('../../../../utilities/getVideoTime');
const { CourseModel } = require('../../../../model/courses');
const { ChapterModel } = require('../../../../model/chapters');

const { ObjectId } = mongoose.Types;
class EpisodesController extends BaseController {
    async getEpisodesListOfChapter(req, res, next) {
        try {
            const { chapterId } = req.query;
            await this.checkExistChapter(chapterId);
            const epidoesOfChapter = await EpisodeModel.aggregate([
                {
                    $match: { chapterId: new ObjectId(chapterId) }
                }
            ]);
            return sendResponseToClient(res, messageCenter.public.success, httpStatusCodes.OK, epidoesOfChapter);
        } catch (error) {
            next(error);
        }
    }

    async getOneEpisode(req, res, next) {
        try {
            const { episodeId } = req.params;
            const episode = (await EpisodeModel.aggregate([
                {
                    $match: { _id: new ObjectId(episodeId) }
                },
                {
                    $lookup: {
                        from: 'chapters',
                        foreignField: '_id',
                        localField: 'chapterId',
                        as: 'chapter',
                    },
                },
                {
                    $project: {
                        'chapter.courseId': 0,
                        'chapter.episodes': 0,
                        'chapter.__v': 0,
                        chapterId: 0,
                        __v: 0
                    }
                },
                {
                    $unwind: '$chapter'
                }
            ]))[0];
            return sendResponseToClient(res, messageCenter.public.success, httpStatusCodes.OK, episode);
        } catch (error) {
            next(error);
        }
    }

    async createEpisode(req, res, next) {
        try {
            const {
                title, description, type, chapterId
            } = req.body;
            const { data: chapter } = await this.checkExistChapter(chapterId);
            let videoAddress;
            let videoDuration;
            if (Object.keys(req.file).length > 1) {
                videoAddress = req.file.uploadedPath;
                const videoSecondes = await getVideoDurationInSeconds(videoAddress);
                videoDuration = getVideoTime(videoSecondes);
            }
            const createdEpisode = await EpisodeModel.create({
                title,
                description,
                type,
                address: videoAddress,
                duration: videoDuration,
                chapterId
            });
            if (createdEpisode) {
                await ChapterModel.updateOne({ _id: chapterId }, {
                    $push: {
                        episodes: createdEpisode.id
                    },
                });
                await ChapterModel.updateChapterDuration(chapterId);
                await CourseModel.updateCourseDuration(chapter.courseId);
            } else {
                throw createHttpError.InternalServerError(messageCenter.public.createFailed);
            }
            return sendResponseToClient(res, messageCenter.public.success, httpStatusCodes.CREATED, createdEpisode);
        } catch (error) {
            next(error);
        }
    }

    async updateEpisode(req, res, next) {
        try {
            const { episodeId } = req.body;
            const episode = await EpisodeModel.findOne({ _id: episodeId });
            let newVideoAddress;
            let newVideoDuration;
            const allowedFiledsToBeUpdate = ['title', 'description', 'type'];
            const filteredBody = filterObj(req.body, allowedFiledsToBeUpdate);
            if (req.file && Object.keys(req.file).length > 1) {
                const oldVideoAddress = episode.address;
                await unlinkFile([oldVideoAddress]);
                newVideoAddress = req.file.uploadedPath;
                const videoSecondes = await getVideoDurationInSeconds(newVideoAddress);
                newVideoDuration = getVideoTime(videoSecondes);
                filteredBody.address = newVideoAddress;
                filteredBody.duration = newVideoDuration;
            }
            const episodeUpdatedRersult = await EpisodeModel.updateOne({ _id: episodeId }, {
                $set: filteredBody
            });
            if (!episodeUpdatedRersult.modifiedCount) {
                throw createHttpError.InternalServerError(messageCenter.public.failedUpdate);
            }
            return res.status(httpStatusCodes.OK).json({
                status: messageCenter.public.success,
                message: messageCenter.public.successUpdate
            });
        } catch (error) {
            next(error);
        }
    }

    async removeEpisode(req, res, next) {
        let episode;
        try {
            const { episodeId } = req.body;
            episode = (await this.checkExistEpisode(episodeId)).data;

            const removeChapterAction = EpisodeModel.deleteOne({ _id: episodeId });
            const removeChapterIdFromCourseChaptersArray = ChapterModel.updateOne({ _id: episode.chapterId }, {
                $pull: {
                    episodes: episodeId
                }
            });
            const removeEpisodeVideoAction = unlinkFile([episode.address]);
            const removeContentResult = await Promise.all([removeChapterAction, removeChapterIdFromCourseChaptersArray, removeEpisodeVideoAction]);
            removeContentResult.forEach((removeResult) => { // TODO: fix this unlink function result that undefined !!!
                if (removeResult?.status === 'rejected') {
                    throw createHttpError.InternalServerError(new Error(messageCenter.course.removeFaild));
                }
            });

            return res.status(httpStatusCodes.OK).json({
                message: messageCenter.public.removeSuccessfull
            });
        } catch (error) {
            if (error.syscall === 'unlink') {
                await EpisodeModel.create(episode._doc);
                await ChapterModel.updateOne({ _id: episode.chapterId }, {
                    $push: {
                        episodes: episode.id
                    }
                });
                next(createHttpError.InternalServerError(messageCenter.public.internalServerErrorMsg));
            } else {
                next(error);
            }
        }
    }

    async checkExistChapter(id) {
        const chapter = await ChapterModel.findOne({ _id: id });
        if (!chapter) throw createHttpError.NotFound('دوره مورد نظر مورد نظر یافت نشد');
        return {
            exist: !!chapter,
            data: chapter,
        };
    }

    async checkExistEpisode(id) {
        const episode = await EpisodeModel.findOne({ _id: id });
        if (!episode) throw createHttpError.NotFound('قسمت مورد نظر مورد نظر یافت نشد');
        return {
            exist: !!episode,
            data: episode,
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

module.exports = new EpisodesController();
