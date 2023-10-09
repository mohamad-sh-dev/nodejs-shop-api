/* eslint-disable no-prototype-builtins */
/* eslint-disable dot-notation */
const createHttpError = require('http-errors');
const { StatusCodes: httpStatusCodes } = require('http-status-codes');
const mongoose = require('mongoose');
const { filterObj, sendResponseToClient, mergeExistContentWithFilteredBody } = require('../../../../utilities/functions');
const BaseController = require('../../baseController');
const { messageCenter } = require('../../../../utilities/messages');
const { PermissionsModel } = require('../../../../model/RBAC/permissions');

const { ObjectId } = mongoose.Types;

class PermissionsController extends BaseController {
    async getPermissionsList(req, res, next) {
        try {
            const { search } = req.query || null;
            let permissions;
            if (search) {
                permissions = await PermissionsModel.findOne({
                    $text: {
                        $search: search
                    }
                });
            } else {
                permissions = await PermissionsModel.aggregate([
                    {
                        $match: {}
                    }
                ]);
            }
            return sendResponseToClient(res, messageCenter.public.success, httpStatusCodes.OK, permissions);
        } catch (error) {
            next(error);
        }
    }

    async addNewPermission(req, res, next) {
        try {
            const {
                title, description, permissions, methods
            } = req.body;
            if (await this.checkPermissionExistWithTitle(title)) throw createHttpError.BadRequest(messageCenter.PERMISSIONS.EXISTCONTENT);
            const createdPermission = await PermissionsModel.create({
                title, description, permissions, methods
            });
            if (!createdPermission) throw createHttpError.InternalServerError(messageCenter.public.internalServerErrorMsg);
            return sendResponseToClient(res, messageCenter.public.success, httpStatusCodes.CREATED, createdPermission, messageCenter.PERMISSIONS.CREATED);
        } catch (error) {
            next(error);
        }
    }

    async getPermissionById(req, res, next) {
        try {
            const { permissionID } = req.params;
            const permission = await PermissionsModel.findById(permissionID);
            return sendResponseToClient(res, messageCenter.public.success, httpStatusCodes.OK, permission);
        } catch (error) {
            next(error);
        }
    }

    async updatePermission(req, res, next) {
        try {
            const { permissionID } = req.body;
            const permission = (await PermissionsModel.aggregate([
                {
                    $match: {
                        _id: new ObjectId(permissionID)
                    }
                }
            ]))[0];
            const allowedFiledsForUpdate = ['title', 'description', 'methods'];
            const filteredBody = filterObj(req.body, allowedFiledsForUpdate);
            const mergedContents = mergeExistContentWithFilteredBody(permission, filteredBody);
            const PermissionUpdatedrersult = await PermissionsModel.updateOne({ _id: permissionID }, {
                $set: mergedContents
            });
            if (!PermissionUpdatedrersult.modifiedCount) {
                throw createHttpError.InternalServerError(messageCenter.public.FAILED_UPDATE);
            }
            return sendResponseToClient(res, messageCenter.public.success, httpStatusCodes.OK, null, messageCenter.public.success);
        } catch (error) {
            next(error);
        }
    }

    async removePermission(req, res, next) {
        try {
            const { permissionID } = req.body;
            await this.checkPermissionExist(permissionID);
            const reqmovePermissionResult = await PermissionsModel.deleteOne({ _id: permissionID });
            if (!reqmovePermissionResult.deletedCount) throw createHttpError.InternalServerError(messageCenter.public.REMOVEFAILED);
            return sendResponseToClient(res, messageCenter.public.success, httpStatusCodes.OK);
        } catch (error) {
            next(error);
        }
    }

    async checkPermissionExist(id) {
        const permission = await PermissionsModel.findOne({ _id: id });
        if (!permission) throw createHttpError.NotFound(messageCenter.public.notFoundContent);
        return {
            exist: !!permission,
            data: permission,
        };
    }

    async checkPermissionExistWithTitle(title) {
        const permission = await PermissionsModel.findOne({ title });
        return permission;
    }
}

module.exports = new PermissionsController();
