const { Router } = require('express');
const { isAuthenticated } = require('../../http/middlewares/authorization');
const productController = require('../../http/controller/admin/product.controller');
const { validateRequestBody } = require('../../http/validations/auth.schema');
const { createUpdateProductSchema, getDeleteProductsSchema } = require('../../model/schemas/products.schema');
const { upload } = require('../../utilities/multerConfig');
const parseToJsonArray = require('../../http/middlewares/jsonArrayPars');
const { restrictTo } = require('../../utilities/functions');

const router = new Router();
router.get(
    '/',
    productController.getAllProducts
);
router.post(
    '/',
    isAuthenticated,
    restrictTo('ADMIN'),
    upload.fields([{ name: 'imageCover' }, { name: 'images', maxCount: 10 }]),
    parseToJsonArray(['tag', 'categories', 'properties']),
    validateRequestBody(createUpdateProductSchema),
    productController.addProduct
);
router.patch(
    '/',
    isAuthenticated,
    restrictTo('ADMIN'),
    upload.single('image'),
    parseToJsonArray(['tag', 'categories']),
    validateRequestBody(createUpdateProductSchema),
    productController.updateProduct
);
router.delete(
    '/',
    isAuthenticated,
    restrictTo('ADMIN'),
    validateRequestBody(getDeleteProductsSchema),
    productController.deleteProduct
);

module.exports = {
    adminProductsRoutes: router,
};
