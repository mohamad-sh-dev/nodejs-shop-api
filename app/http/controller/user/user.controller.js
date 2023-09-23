const { StatusCodes: httpStatusCodes } = require('http-status-codes');
const createHttpError = require('http-errors');
const BaseController = require('../baseController');
const { UserModel } = require('../../../model/user');

const { messageCenter } = require('../../../utilities/messages');
const {
    sendResponseToClient, filterObj, mergeExistContentWithFilteredBody
} = require('../../../utilities/functions');
const unlinkFile = require('../../../utilities/unlinkFile');
const { publicDefinitions } = require('../../../utilities/publicDefinitions');

class UserController extends BaseController {
    async getListOfUsers(req, res, next) {
        let users;
        try {
            const { search } = req.query;
            if (search) {
                users = await UserModel.findOne({
                    $text: {
                        $search: search
                    }
                });
            } else {
                users = await UserModel.find().sort({ createdAt: 1 });
            }
            return sendResponseToClient(res, messageCenter.public.success, httpStatusCodes.OK, users);
        } catch (error) {
            next(error);
        }
    }

    async getProfile(req, res, next) {
        try {
            const { id } = req.user;
            const user = await UserModel.findOne({
                _id: id
            });
            return sendResponseToClient(res, messageCenter.public.success, httpStatusCodes.OK, user);
        } catch (error) {
            next(error);
        }
    }

    async updateProfile(req, res, next) {
        try {
            const { id } = req.user;
            const { data: user } = await this.findUser(id);
            if (Object.keys(req.file).length > 1) {
                const oldProfileImagePath = user.profileImage;
                await unlinkFile([oldProfileImagePath]);
                const newProfileImagePath = req.file.uploadedPath;
                req.body.profileImage = newProfileImagePath;
            }
            const filteredBody = filterObj(req.body, publicDefinitions.userAllowedFieldsToBeUpdated());
            const mergedContents = mergeExistContentWithFilteredBody(user, filteredBody);
            const updateResult = await UserModel.updateOne({ _id: id }, {
                $set: mergedContents
            });
            if (!updateResult.modifiedCount) throw createHttpError.InternalServerError(messageCenter.public.FAILED_UPDATE);
            return sendResponseToClient(res, messageCenter.public.success, httpStatusCodes.OK, null, messageCenter.public.successUpdate);
        } catch (error) {
            next(error);
        }
    }

    async removeUser(req, res, next) {
        try {
            const { userID } = req.body;
            await this.find(userID);
            const removeUserResult = await UserModel.deleteOne({ _id: userID });
            if (!removeUserResult.deletedCount) throw createHttpError.InternalServerError(messageCenter.public.REMOVEFAILED);
            return sendResponseToClient(res, messageCenter.public.success, httpStatusCodes.OK);
        } catch (error) {
            next(error);
        }
    }

    async findUser(id) {
        const user = await UserModel.findById(id);
        if (!user) throw createHttpError.NotFound(messageCenter.USER.NOTFOUND);
        return {
            exist: !!user,
            data: user
        };
    }
}
module.exports = new UserController();
