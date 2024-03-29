const { Router } = require('express');
const productController = require('../../../http/controller/admin/products/product.controller');
const { validateRequestBody } = require('../../../http/validations/auth.schema');
const { createUpdateProductSchema, getDeleteProductSchema, updateProductSchema } = require('../../../model/schemas/products.schema');
const { fileUpload } = require('../../../utilities/multerConfig');
const parseToJsonArray = require('../../../http/middlewares/jsonArrayPars');
const {
 REQUEST_PARAMS, UPLOAD_FIELD_NAMES, UPLOADS_ENTITIES, REQUEST_BODY_FIELD_NAMES
} = require('../../../utilities/constants');

const router = new Router();
router.get(
    '/',
    productController.getAllProducts
);
router.get(
    '/:productId',
    validateRequestBody(getDeleteProductSchema, REQUEST_PARAMS),
    productController.getProductById
);
router.post(
    '/',
    fileUpload(UPLOADS_ENTITIES.PRODUCTS).fields([{ name: UPLOAD_FIELD_NAMES.IMAGECOVER }, { name: UPLOAD_FIELD_NAMES.IMAGES, maxCount: 10 }]),
    parseToJsonArray(['tags', 'properties']),
    validateRequestBody(createUpdateProductSchema),
    productController.addProduct
);
router.patch(
    '/',
    fileUpload(UPLOADS_ENTITIES.PRODUCTS).fields([{ name: UPLOAD_FIELD_NAMES.IMAGECOVER }, { name: UPLOAD_FIELD_NAMES.IMAGES, maxCount: 10 }]),
    parseToJsonArray([REQUEST_BODY_FIELD_NAMES.TAGS, REQUEST_BODY_FIELD_NAMES.CATEGORIES, REQUEST_BODY_FIELD_NAMES.PROPERTIES]),
    validateRequestBody(updateProductSchema),
    productController.updateProduct
);
router.delete(
    '/',
    validateRequestBody(getDeleteProductSchema),
    productController.removeProduct
);

module.exports = {
    adminProductsRoutes: router,
};
