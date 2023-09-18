const express = require('express');
const coursesController = require('../../../http/controller/admin/courses/courses.controller');
const { fileUpload } = require('../../../utilities/multerConfig');
const { createUpdateCoursesSchema, getDeleteCoursesSchema, updateCoursesSchema } = require('../../../model/schemas/courses.schema');
const { validateRequestBody } = require('../../../http/validations/auth.schema');
const { restrictTo } = require('../../../utilities/functions');
const { isAuthenticated } = require('../../../http/middlewares/authorization');
const parseToJsonArray = require('../../../http/middlewares/jsonArrayPars');
const { REQUEST_PARAMS } = require('../../../utilities/constants');

const { Router } = express;

const router = new Router();

router.get('/', coursesController.getListofCourses);

router.get('/:courseId', validateRequestBody(getDeleteCoursesSchema, REQUEST_PARAMS), coursesController.findCourseById);

router.post(
    '/',
    isAuthenticated,
    restrictTo('ADMIN'),
    fileUpload('courses').single('imageCover'),
    parseToJsonArray(['tags']),
    validateRequestBody(createUpdateCoursesSchema),
    coursesController.createCourse
);
router.patch(
    '/',
    isAuthenticated,
    restrictTo('ADMIN'),
    fileUpload('courses').single('imageCover'),
    parseToJsonArray(['tags']),
    validateRequestBody(updateCoursesSchema),
    coursesController.updateCourse
);
router.delete(
    '/',
    isAuthenticated,
    restrictTo('ADMIN'),
    fileUpload('courses').single('imageCover'),
    parseToJsonArray(['tags']),
    validateRequestBody(getDeleteCoursesSchema),
    coursesController.removeCourse
);

module.exports = {
    adminCoursesRoutes: router
};
