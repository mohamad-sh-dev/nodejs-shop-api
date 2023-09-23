/* eslint-disable no-prototype-builtins */
/* eslint-disable dot-notation */
const createHttpError = require('http-errors');
const { StatusCodes: httpStatusCodes } = require('http-status-codes');
const mongoose = require('mongoose');
const { ProductModel } = require('../../../../model/product');
const { filterObj, assignUploadPathToImages, sendResponseToClient } = require('../../../../utilities/functions');
const BaseController = require('../../baseController');
const { messageCenter } = require('../../../../utilities/messages');
const unlinkFile = require('../../../../utilities/unlinkFile');
const { publicDefinitions } = require('../../../../utilities/publicDefinitions');

const { ObjectId } = mongoose.Types;

class ProductController extends BaseController {
    async addProduct(req, res, next) {
        try {
            const {
                summary, discount, price, type, title, description, category, tags, properties
            } = req.body;
            let images;
            let imageCover;
            if (Object.keys(req.files).length > 1) {
                images = req.files.images.map((imageObject) => imageObject.uploadedPath);
                imageCover = req.files.imageCover[0].uploadedPath;
            }
            const createdProduct = await ProductModel.create({
                summary,
                discount,
                price,
                type,
                title,
                description,
                category,
                tags,
                properties,
                images,
                imageCover,
                suplier: req.user.id
            });
            return sendResponseToClient(res, messageCenter.public.success, httpStatusCodes.CREATED, createdProduct);
        } catch (error) {
            next(error);
        }
    }

    async getProductById(req, res, next) {
        try {
            const { productId } = req.params;
            const { data: product } = await this.checkExistProduct(productId);
            return sendResponseToClient(res, messageCenter.public.success, httpStatusCodes.OK, product);
        } catch (error) {
            next(error);
        }
    }

    async updateProduct(req, res, next) {
        try {
            const { productId } = req.body;
            const product = (await ProductModel.aggregate([
                {
                    $match: {
                        _id: new ObjectId(productId)
                    }
                }
            ]))[0];
            const filteredBody = filterObj(req.body, publicDefinitions.productsAllowedFieldsToBeUpdated());
            if (Object.keys(req.files).length > 1) {
                const { images, imageCover } = assignUploadPathToImages(req.files);
                filteredBody['images'] = images;
                filteredBody['imageCover'] = imageCover;
            }
            Object.keys(product).forEach((key) => {
                if (Array.isArray(product[key]) && filteredBody.hasOwnProperty(key)) {
                    filteredBody[key] = product[key].concat(filteredBody[key]);
                } else if (typeof product[key] === 'object' && filteredBody.hasOwnProperty(key)) {
                    filteredBody[key] = Object.assign(product[key], filteredBody[key]);
                }
            });
            const productUpdatedrersult = await ProductModel.updateOne({ _id: productId }, {
                $set: filteredBody
            });
            if (!productUpdatedrersult.modifiedCount) {
                throw createHttpError.InternalServerError(messageCenter.product.failedUpdate);
            }
            return sendResponseToClient(res, messageCenter.public.success, httpStatusCodes.OK, null, messageCenter.public.successUpdate);
        } catch (error) {
            next(error);
        }
    }

    async removeProduct(req, res, next) {
        try {
            const { productId } = req.body;
            const { data: product } = await this.checkExistProduct(productId);
            const removeProductImagesFromServer = unlinkFile([...product.images, product?.imageCover]);
            const removeProductAction = ProductModel.deleteOne({ _id: productId });
            const removeContentResult = await Promise.all([removeProductImagesFromServer, removeProductAction]);
            removeContentResult.forEach((removeResult) => { // TODO: fix this unlink function result that undefined !!!
                if (removeResult?.status === 'rejected') {
                    throw createHttpError.InternalServerError(new Error(messageCenter.product.removeFaild));
                }
            });
            return sendResponseToClient(res, messageCenter.public.success, httpStatusCodes.OK, null, messageCenter.public.removeSuccessfull);
        } catch (error) {
            next(error);
        }
    }

    async getAllProducts(req, res, next) {
        try {
            const { search } = req.query;
            let products;
            if (search) {
                products = await ProductModel.findOne({
                    $text: {
                        $search: search
                    }
                }, { __v: 0, createdAt: 0, updatedAt: 0 }).populate({
                    path: 'category',
                    select: {
                        name: 1,
                        _id: 0,
                        subCategoryDetails: 0
                    }
                });
            } else {
                products = await ProductModel.aggregate([
                    {
                        $match: {}
                    },
                    {
                        $lookup: {
                            from: 'categories',
                            foreignField: '_id',
                            localField: 'category',
                            as: 'category',
                        },
                    },
                    {
                        $unwind: '$category'
                    },
                    {
                        $project: {
                            createdAt: 0,
                            updatedAt: 0,
                            __v: 0,
                            'category._id': 0,
                            'category.parentCategory': 0,
                            'category.subCategory': 0,
                            'category.createdAt': 0,
                            'category.updatedAt': 0,
                            'category.__v': 0,
                        },
                    },
                ]);
            }
            return sendResponseToClient(res, messageCenter.public.success, httpStatusCodes.OK, products);
        } catch (error) {
            next(error);
        }
    }

    async checkExistProduct(id) {
        const product = await ProductModel.findOne({ _id: id });
        if (!product) throw createHttpError.NotFound(messageCenter.public.notFoundContent);
        return {
            exist: !!product,
            data: product,
        };
    }
}

module.exports = new ProductController();
