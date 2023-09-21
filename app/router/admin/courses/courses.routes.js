const express = require('express');
const coursesController = require('../../../http/controller/admin/courses/courses.controller');
const { fileUpload } = require('../../../utilities/multerConfig');
const { createUpdateCoursesSchema, getDeleteCoursesSchema, updateCoursesSchema } = require('../../../model/schemas/courses.schema');
const { validateRequestBody } = require('../../../http/validations/auth.schema');
const parseToJsonArray = require('../../../http/middlewares/jsonArrayPars');
const { REQUEST_PARAMS } = require('../../../utilities/constants');

const { Router } = express;

const router = new Router();

router.get('/', coursesController.getListofCourses);

router.get('/:courseId', validateRequestBody(getDeleteCoursesSchema, REQUEST_PARAMS), coursesController.findCourseById);

router.post(
    '/',
    fileUpload('courses').single('imageCover'),
    parseToJsonArray(['tags']),
    validateRequestBody(createUpdateCoursesSchema),
    coursesController.createCourse
);
router.patch(
    '/',
    fileUpload('courses').single('imageCover'),
    parseToJsonArray(['tags']),
    validateRequestBody(updateCoursesSchema),
    coursesController.updateCourse
);
router.delete(
    '/',
    fileUpload('courses').single('imageCover'),
    parseToJsonArray(['tags']),
    validateRequestBody(getDeleteCoursesSchema),
    coursesController.removeCourse
);

module.exports = {
    adminCoursesRoutes: router
};
