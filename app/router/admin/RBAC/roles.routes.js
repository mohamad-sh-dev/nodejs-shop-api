const { Router } = require('express');
const { validateRequestBody } = require('../../../http/validations/auth.schema');
const rolesController = require('../../../http/controller/admin/RBAC/roles.controller');
const { createRoleSchema, updateRolesSchema, deleteRoleSchema } = require('../../../model/schemas/RBAC/roles.schema');
const parseToJsonArray = require('../../../http/middlewares/jsonArrayPars');
const { hasPermission } = require('../../../http/validations/RBAC.guard');
const { REQUEST_QUERY, REQUEST_BODY_FIELD_NAMES } = require('../../../utilities/constants');

const router = new Router();
router.get(
    '/list',
    rolesController.getRolesList
);
router.post(
    '/',
    parseToJsonArray([REQUEST_BODY_FIELD_NAMES.PERMISSIONS]),
    validateRequestBody(createRoleSchema),
    rolesController.addNewRole
);
router.patch(
    '/',
    // ,
    parseToJsonArray([REQUEST_BODY_FIELD_NAMES.PERMISSIONS]),
    validateRequestBody(updateRolesSchema),
    rolesController.updateRole
);
router.delete(
    '/',
    hasPermission,
    validateRequestBody(deleteRoleSchema, REQUEST_QUERY),
    rolesController.removeRole
);

module.exports = {
    adminRolesRoutes: router,
};
