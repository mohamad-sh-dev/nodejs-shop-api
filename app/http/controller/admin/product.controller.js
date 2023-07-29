const { ProductModel } = require('../../../model/product');
const BaseController = require('../baseController');

class ProductController extends BaseController {
    async addProduct(req, res, next) {
        try {
            const {
                summary, discount, price, type, title, description, category, tag, properties
            } = req.body;
            let { images, imageCover } = req.files;
            images = images.map((imageObject) => imageObject.uploadedPath);
            imageCover = imageCover[0].uploadedPath;
            const createdProduct = await ProductModel.create({
                summary,
                discount,
                price,
                type,
                title,
                description,
                category,
                tag,
                properties,
                images,
                imageCover,
                suplier: req.user.id
            });
            res.status(201).json({
                message: 'success',
                data: createdProduct
            });
        } catch (error) {
            next(error);
        }
    }

    async getProductById(req, res, next) {
        try {

        } catch (error) {

        }
    }

    async updateProduct(req, res, next) {
        try {

        } catch (error) {

        }
    }

    async deleteProduct(req, res, next) {
        try {

        } catch (error) {

        }
    }

    async getAllProducts(req, res, next) {
        try {
            const products = await ProductModel.aggregate([
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
            return res.status(200).json({
                status: 'success',
                data: products
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ProductController();
