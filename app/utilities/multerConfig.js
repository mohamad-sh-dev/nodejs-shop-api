/* eslint-disable object-shorthand */
/* eslint-disable func-names */
const createHttpError = require('http-errors');
const multer = require('multer');
const path = require('path');
const fsPromises = require('fs').promises;

const date = new Date();
const year = date.getFullYear().toString();
const month = date.getMonth().toString();
const day = date.getDay().toString();

async function makeUploadDestination() {
    const dirPath = path.join(__dirname, '..', '..', 'public', 'uploads', 'blogs');
    const finalDirectoryPath = path.join(dirPath, year, month, day);
    await fsPromises.mkdir(finalDirectoryPath, { recursive: true });
    return finalDirectoryPath;
}

const storage = multer.diskStorage({
    destination: async function (req, file, cb) {
        const uploadDestination = await makeUploadDestination();
        cb(null, uploadDestination);
    },
    filename: function (req, file, cb) {
        const fileName = `${file.fieldname}${new Date().getTime() + path.extname(file.originalname)}`;
        const uploadedFilePath = path.join('uploads', 'blogs', year, month, day, fileName);
        file.uploadedPath = uploadedFilePath.replace(/\\/g, '/');
        cb(null, fileName);
    }
});

const fileFilter = function (req, file, cb) {
    const extentionName = file.mimetype;
    const allowedExtNames = ['image/png', 'image/jpg', 'image/jpeg'];
    if (!allowedExtNames.includes(extentionName)) {
        cb(createHttpError.BadRequest('فرمت فایل صحیح نمیباشد', 400));
    } else {
        cb(null, file);
    }
};
exports.upload = multer({ storage, fileFilter, limits: 1 * 1000 * 1000 });
