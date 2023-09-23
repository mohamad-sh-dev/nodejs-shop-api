const express = require('express');
const coursesController = require('../../../http/controller/admin/courses/courses.controller');
const { fileUpload } = require('../../../utilities/multerConfig');
const { createUpdateCoursesSchema, getDeleteCoursesSchema, updateCoursesSchema } = require('../../../model/schemas/courses.schema');
const { validateRequestBody } = require('../../../http/validations/auth.schema');
const parseToJsonArray = require('../../../http/middlewares/jsonArrayPars');
const {
    REQUEST_PARAMS, UPLOADS_ENTITIES, REQUEST_BODY_FIELD_NAMES, UPLOAD_FIELD_NAMES
} = require('../../../utilities/constants');

const { Router } = express;

const router = new Router();

router.get('/', coursesController.getListofCourses);

router.get('/:courseId', validateRequestBody(getDeleteCoursesSchema, REQUEST_PARAMS), coursesController.findCourseById);

router.post(
    '/',
    fileUpload(UPLOADS_ENTITIES.COURSES).single(UPLOAD_FIELD_NAMES.IMAGECOVER),
    parseToJsonArray([REQUEST_BODY_FIELD_NAMES.TAGS]),
    validateRequestBody(createUpdateCoursesSchema),
    coursesController.createCourse
);
router.patch(
    '/',
    fileUpload(UPLOADS_ENTITIES.COURSES).single(UPLOAD_FIELD_NAMES.IMAGECOVER),
    parseToJsonArray([REQUEST_BODY_FIELD_NAMES.TAGS]),
    validateRequestBody(updateCoursesSchema),
    coursesController.updateCourse
);
router.delete(
    '/',
    fileUpload(UPLOADS_ENTITIES.COURSES).single(UPLOAD_FIELD_NAMES.IMAGECOVER),
    parseToJsonArray([REQUEST_BODY_FIELD_NAMES.TAGS]),
    validateRequestBody(getDeleteCoursesSchema),
    coursesController.removeCourse
);

module.exports = {
    adminCoursesRoutes: router
};
