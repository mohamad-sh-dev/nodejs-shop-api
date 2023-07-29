const createHttpError = require('http-errors');
const mongoose = require('mongoose');
const { CategoryModel } = require('../../../model/categories');
const BaseController = require('../baseController');

const { ObjectId } = mongoose.Types;

class CategoryManager extends BaseController {
  // Create category
  async createCategory(req, res, next) {
    try {
      const { name, parentCategory, subCategory } = req.body;
      const existCategory = await this.checkCategoryExist(name);
      if (existCategory.exist) { throw createHttpError.BadRequest('دسته بندی مورد نظر وجود دارد'); }
      const createdCategory = await CategoryModel.create({ name, parentCategory, subCategory });
      if (parentCategory) {
        await CategoryModel.aggregate([
          {
            $addFields: {
              subCategory: { $concatArrays: ['$subCategory', [new ObjectId(createdCategory.id)]] },
            },
          },
          {
            $out: 'categories',
          },
        ]);
      }
      res.status(201).json({
        message: 'دسته بندی با موفقیت ایجاد شد',
      });
    } catch (error) {
      next(error);
    }
  }

  // Read category
  async getCategory(req, res, next) {
    try {
      const { categoryId, name } = req.params;
      const category = await CategoryModel.findOne({
        $or: [{ _id: categoryId }, { name }],
      });
      if (!category) { throw createHttpError.NotFound('دسته بندی مورد نظر موجود نمیباشد'); }
      return res.status(200).json({
        status: 'success',
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllCategories(req, res, next) {
    try {
      const categories = await CategoryModel.find({}, { __v: 0, createdAt: 0, updatedAt: 0 });
      return res.status(200).json({
        status: 'success',
        data: categories,
      });
    } catch (error) {
      next(error);
    }
  }

  async getCategoriesList(req, res, next) {
    try {
      const categories = await CategoryModel.aggregate([
        {
          $match: {},
        },
      ]);
      return res.status(200).json({
        status: 'success',
        data: categories,
      });
    } catch (error) {
      next(error);
    }
  }

  // Update category
  async updateCategory(req, res, next) {
    try {
      const { id: _id, name } = req.body;
      console.log(_id);
      const category = (await this.checkCategoryExist(name, _id)).data;
      if (!category) { throw createHttpError.NotFound('دسته بندی مورد نظر موجود نیست'); }
      const updatedCategory = await CategoryModel.updateOne(
        { _id },
        {
          name,
        },
        {
          runValidators: true,
        },
      );
      if (updatedCategory.modifiedCount !== 1) { throw createHttpError.InternalServerError('خطای داخلی سرور'); }
      return res.status(200).json({
        message: 'اپدیت باموفقیت انجام شد',
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete category
  async deleteCategory(req, res, next) {
    try {
      const { id: _id } = req.params;
      // let hasSubCategories = await this.checkHasSubCategories(_id);
      // console.log(hasSubCategories);
      // if (hasSubCategories)
      //   throw createHttpError.BadRequest(
      //     "دسته بندی مورد نظر دارای زیر مجموعه میباشد"
      //   );
      // const relatedSubCategories = await CategoryModel.aggregate([
      //   {
      //     $match: {
      //       subCategory: {
      //         $in: [new ObjectId(_id)],
      //       },
      //     },
      //   },
      // ]);
      // if(relatedSubCategories.length) throw createHttpError.BadRequest()
      const category = await CategoryModel.deleteMany({
        $or:
          [
            { _id }, { parentCategory: _id },
          ],
      });
      if (!category) { throw createHttpError.InternalServerError('خطای داخلی سرور'); }
      return res.status(200).json({
        status: 'success',
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }

  async checkCategoryExist(name, id) {
    const category = await CategoryModel.findOne({
      $or: [
        {
          _id: id,
        },
        { name },
      ],
    });
    return {
      exist: !!category,
      data: category,
    };
  }

  async checkHasSubCategories(categoryId) {
    try {
      const category = await CategoryModel.findOne({ _id: categoryId });
      console.log(category);
      return !!category.subCategory.length;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new CategoryManager();
