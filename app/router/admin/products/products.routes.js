const { Router } = require('express');
const productController = require('../../../http/controller/admin/products/product.controller');
const { validateRequestBody } = require('../../../http/validations/auth.schema');
const { createUpdateProductSchema, getDeleteProductSchema, updateProductSchema } = require('../../../model/schemas/products.schema');
const { fileUpload } = require('../../../utilities/multerConfig');
const parseToJsonArray = require('../../../http/middlewares/jsonArrayPars');
const { REQUEST_PARAMS } = require('../../../utilities/constants');

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
    fileUpload('products').fields([{ name: 'imageCover' }, { name: 'images', maxCount: 10 }]),
    parseToJsonArray(['tags', 'properties']),
    validateRequestBody(createUpdateProductSchema),
    productController.addProduct
);
router.patch(
    '/',
    fileUpload('products').fields([{ name: 'imageCover' }, { name: 'images', maxCount: 10 }]),
    parseToJsonArray(['tags', 'categories', 'properties']),
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
