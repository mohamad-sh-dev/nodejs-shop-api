const { Router } = require('express');
const { validateRequestBody } = require('../../../http/validations/auth.schema');
const parseToJsonArray = require('../../../http/middlewares/jsonArrayPars');
const permissionsController = require('../../../http/controller/admin/RBAC/permissions.controller');
const { updatePermissionSchema, getDeletePermissionsSchema } = require('../../../model/schemas/RBAC/permissions.schema');
const { createPermissionSchema } = require('../../../model/schemas/RBAC/permissions.schema');

const router = new Router();
router.get(
    '/list',
    permissionsController.getPermissionsList
);
router.post(
    '/',
    parseToJsonArray(['methods']),
    validateRequestBody(createPermissionSchema),
    permissionsController.addNewPermission
);
router.patch(
    '/',
    parseToJsonArray(['methods']),
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
