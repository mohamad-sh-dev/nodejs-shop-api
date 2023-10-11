const createHttpError = require('http-errors');
const { RolesModel } = require('../../model/RBAC/roles');
const { messageCenter } = require('../../utilities/messages');
const { MASTER_ROLE } = require('../../utilities/constants');

async function hasPermission(req, res, next) {
    try {
        const { role } = req.user;
        const rolesDocument = await RolesModel.findOne({ name: role }).populate({
            path: 'permissions',
            select: { title: 1, methods: 1, _id: 0 }
        });
        if (!rolesDocument) throw new createHttpError.Forbidden(messageCenter.PERMISSIONS.NOT_ACCESS);

        if (role === MASTER_ROLE && !rolesDocument.permissions.length) {
            return next();
        }

        const requestedRouteSegments = req.baseUrl.split('/').filter(Boolean);
        const userPermissions = rolesDocument.permissions;

        const hasAccess = userPermissions.some((permission) => {
            const permissionMethods = permission.methods;
            const permissionRouteSegments = permission.title.split('/');

            return (
                (permissionMethods.includes(req.method) || permissionMethods === '*')
                && requestedRouteSegments.every((segment, index) => {
                    const permissionSegment = permissionRouteSegments[index];
                    return permissionSegment === '*' || segment === permissionSegment;
                })
            );
        });
        if (!hasAccess) {
            throw new createHttpError.Forbidden(messageCenter.PERMISSIONS.NOT_ACCESS);
        }
        next();
    } catch (err) {
        next(err);
    }
}

module.exports = {
    hasPermission
};
