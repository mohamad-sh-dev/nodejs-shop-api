/* eslint-disable no-prototype-builtins */
/* eslint-disable dot-notation */
const createHttpError = require('http-errors');
const { StatusCodes: httpStatusCodes } = require('http-status-codes');
const mongoose = require('mongoose');
const { filterObj, sendResponseToClient } = require('../../../../utilities/functions');
const BaseController = require('../../baseController');
const { messageCenter } = require('../../../../utilities/messages');
const { RolesModel } = require('../../../../model/RBAC/roles');

const { ObjectId } = mongoose.Types;

class RolesController extends BaseController {
    async getRolesList(req, res, next) {
        try {
            const { search } = req.query || null;
            let roles;
            if (search) {
                roles = await RolesModel.findOne({
                    $text: {
                        $search: search
                    }
                }, { __v: 0, createdAt: 0, updatedAt: 0 }).populate({
                    path: 'category',
                    select: {
                        name: 1,
                        _id: 0,
                        subCategoryDetails: 0
                    }
                });
            } else {
                roles = await RolesModel.aggregate([
                    {
                        $match: {}
                    }
                ]);
            }
            return sendResponseToClient(res, messageCenter.public.success, httpStatusCodes.OK, roles);
        } catch (error) {
            next(error);
        }
    }

    async addNewRole(req, res, next) {
        try {
            const { name, description, permissions } = req.body;
            if (await this.checkRoleExistWithName(name)) throw createHttpError.BadRequest(messageCenter.ROLES.EXISTCONTENT);
            const createdRole = await RolesModel.create({ name: name.toUpperCase(), description, permissions });
            if (!createdRole) throw createHttpError.InternalServerError(messageCenter.public.internalServerErrorMsg);
            return sendResponseToClient(res, messageCenter.public.success, httpStatusCodes.CREATED, createdRole);
        } catch (error) {
            next(error);
        }
    }

    async getRoleById(req, res, next) {
        try {
            const { title, id } = req.query;
            const role = await RolesModel.findOne({
                $or: [
                    { _id: id },
                    { title }
                ]
            });
            return sendResponseToClient(res, messageCenter.public.success, httpStatusCodes.OK, role);
        } catch (error) {
            next(error);
        }
    }

    async updateRole(req, res, next) {
        try {
            const { roleID, title } = req.body;
            const { _doc: role } = (await this.checkRoleExist(roleID, title)).data;
            const allowedFiledsForUpdate = ['name', 'description', 'permissions'];
            const filteredBody = filterObj(req.body, allowedFiledsForUpdate);
            Object.keys(role).forEach((key) => {
                if (Array.isArray(role[key]) && filteredBody.hasOwnProperty(key)) {
                    filteredBody[key] = role[key].concat(filteredBody[key]);
                } else if (typeof role[key] === 'object' && filteredBody.hasOwnProperty(key)) {
                    filteredBody[key] = Object.assign(role[key], filteredBody[key]);
                }
            });
            const roleUpdatedrersult = await RolesModel.updateOne({ _id: roleID }, {
                $set: filteredBody
            });
            if (!roleUpdatedrersult.modifiedCount) {
                throw createHttpError.InternalServerError(messageCenter.role.failedUpdate);
            }
            return res.status(httpStatusCodes.OK).json({
                status: messageCenter.public.success,
                message: messageCenter.public.successUpdate
            });
        } catch (error) {
            next(error);
        }
    }

    async removeRole(req, res, next) {
        try {
            const { roleID, name } = req.query;
            await this.checkRoleExist(roleID, name);
            const removeRoleResult = await RolesModel.deleteOne({
                $or: [
                    {
                        name
                    },
                    {
                        _id: new ObjectId(roleID)
                    }
                ]
            });

            if (!removeRoleResult.deletedCount) throw createHttpError.InternalServerError(messageCenter.public.REMOVEFAILED);
            return sendResponseToClient(res, messageCenter.public.success, httpStatusCodes.OK,);
        } catch (error) {
            next(error);
        }
    }

    async checkRoleExist(id, name) {
        const role = await RolesModel.findOne({
            $or: [
                {
                    name
                },
                {
                    _id: new ObjectId(id)
                }
            ]
        });
        if (!role) throw createHttpError.NotFound(messageCenter.public.notFoundContent);
        return {
            exist: !!role,
            data: role,
        };
    }

    async checkRoleExistWithName(name) {
        const role = await RolesModel.findOne({ name });
        return role;
    }
}

module.exports = new RolesController();
