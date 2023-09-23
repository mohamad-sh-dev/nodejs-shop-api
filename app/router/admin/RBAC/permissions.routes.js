const { Router } = require('express');
const { validateRequestBody } = require('../../../http/validations/auth.schema');
const parseToJsonArray = require('../../../http/middlewares/jsonArrayPars');
const permissionsController = require('../../../http/controller/admin/RBAC/permissions.controller');
const { updatePermissionSchema, getDeletePermissionsSchema } = require('../../../model/schemas/RBAC/permissions.schema');
const { createPermissionSchema } = require('../../../model/schemas/RBAC/permissions.schema');
const { REQUEST_BODY_FIELD_NAMES } = require('../../../utilities/constants');

const router = new Router();
router.get(
    '/list',
    permissionsController.getPermissionsList
);
router.post(
    '/',
    parseToJsonArray([REQUEST_BODY_FIELD_NAMES.METHODS]),
    validateRequestBody(createPermissionSchema),
    permissionsController.addNewPermission
);
router.patch(
    '/',
    parseToJsonArray([REQUEST_BODY_FIELD_NAMES.METHODS]),
    validateRequestBody(updatePermissionSchema),
    permissionsController.updatePermission
);
router.delete(
    '/',
    validateRequestBody(getDeletePermissionsSchema),
    permissionsController.removePermission
);

module.exports = {
    adminPermissionsRoutes: router,
};
