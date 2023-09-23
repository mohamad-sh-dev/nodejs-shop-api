/* eslint-disable object-shorthand */
/* eslint-disable func-names */
const createHttpError = require('http-errors');
const multer = require('multer');
const path = require('path');
const fsPromises = require('fs').promises;
const { StatusCodes: httpStatusCodes } = require('http-status-codes');
const { messageCenter } = require('./messages');
const { publicDefinitions } = require('./publicDefinitions');
const { LIMIT_SIZES } = require('./constants');

const date = new Date();
const year = date.getFullYear().toString();
const month = date.getMonth().toString();
const day = date.getDay().toString();

async function makeUploadDestination(entity) {
    const dirPath = path.join(__dirname, '..', '..', 'public', 'uploads', entity);
    const finalDirectoryPath = path.join(dirPath, year, month, day);
    await fsPromises.mkdir(finalDirectoryPath, { recursive: true });
    return finalDirectoryPath;
}
const storage = function (entity) {
    return multer.diskStorage({
        destination: async function (req, file, cb) {
            const uploadDestination = await makeUploadDestination(entity);
            cb(null, uploadDestination);
        },
        filename: async function (req, file, cb) {
            const fileName = `${file.fieldname}${new Date().getTime() + path.extname(file.originalname)}`;
            const uploadedFilePath = path.join('uploads', entity, year, month, day, fileName);
            const fileUrl = `${req.protocol}://${req.get('host')}/`;
            // eslint-disable-next-line no-param-reassign
            file.uploadedPath = `${fileUrl}${uploadedFilePath.replace(/\\/g, '/')}`;
            cb(null, fileName);
        }
    });
};

const fileFilter = function (req, file, cb) {
    const extentionName = file.mimetype;
    const allowedExtNames = publicDefinitions.allowedImagesFormats();
    if (!allowedExtNames.includes(extentionName)) {
        cb(createHttpError.BadRequest(messageCenter.MULTER.INCCORECT_FILE_FORMAT, httpStatusCodes.BAD_REQUEST));
    } else {
        cb(null, file);
    }
};
const videoFilter = function (req, file, cb) {
    const extentionName = file.mimetype;
    const allowedExtNames = publicDefinitions.allowedVideosFormats();
    if (!allowedExtNames.includes(extentionName)) {
        cb(createHttpError.BadRequest(messageCenter.MULTER.INCCORECT_FILE_FORMAT, httpStatusCodes.BAD_REQUEST));
    } else {
        cb(null, file);
    }
};
function fileUpload(entity) {
    const limitSize = LIMIT_SIZES.FILES;
    return multer({ storage: storage(entity), fileFilter, limits: limitSize });
}
function videoUpload(entity) {
    const limitSize = LIMIT_SIZES.VIDEOS;
    return multer({ storage: storage(entity), fileFilter: videoFilter, limits: limitSize });
}

module.exports = {
    fileUpload,
    videoUpload
};
