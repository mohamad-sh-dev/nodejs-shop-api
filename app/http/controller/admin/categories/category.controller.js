const createHttpError = require('http-errors');
const { StatusCodes: httpStatusCodes } = require('http-status-codes');
const { CategoryModel } = require('../../../../model/categories');
const BaseController = require('../../baseController');
const { messageCenter } = require('../../../../utilities/messages');
const { sendResponseToClient } = require('../../../../utilities/functions');

class CategoryManager extends BaseController {
  // Create category
  async createCategory(req, res, next) {
    try {
      const { name, parentCategory, subCategory } = req.body;
      const existCategory = await this.checkCategoryExist(name);
      if (existCategory.exist) { throw createHttpError.BadRequest(messageCenter.public.DUPLICATE_CONTENT); }
      const createdCategory = await CategoryModel.create({ name, parentCategory, subCategory });
      // if (parentCategory) {
      //   await CategoryModel.aggregate([
      //     {
      //       $addFields: {
      //         subCategory: { $concatArrays: ['$subCategory', [new ObjectId(createdCategory.id)]] },
      //       },
      //     },
      //     {
      //       $out: 'categories',
      //     },
      //   ]);
      // }
      return sendResponseToClient(res, messageCenter.public.success, httpStatusCodes.CREATED, createdCategory, messageCenter.CATEGORIES.CREATED);
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
      }).populate({ path: 'parentCategory' });
      if (!category) { throw createHttpError.NotFound(messageCenter.public.notFoundContent); }
      return sendResponseToClient(res, messageCenter.public.success, httpStatusCodes.OK, category);
    } catch (error) {
      next(error);
    }
  }

  async getAllCategories(req, res, next) {
    try {
      const categories = await CategoryModel.find({}, { __v: 0, createdAt: 0, updatedAt: 0 });
      return sendResponseToClient(res, messageCenter.public.success, httpStatusCodes.OK, categories);
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
      return sendResponseToClient(res, messageCenter.public.success, httpStatusCodes.OK, categories);
    } catch (error) {
      next(error);
    }
  }

  // Update category
  async updateCategory(req, res, next) {
    try {
      const { id: _id, name } = req.body;
      const category = (await this.checkCategoryExist(name, _id)).data;
      if (!category) { throw createHttpError.NotFound(messageCenter.public.notFoundContent); }
      const updatedCategory = await CategoryModel.updateOne(
        { _id },
        {
          name,
        },
        {
          runValidators: true,
        },
      );
      if (!updatedCategory.modifiedCount) { throw createHttpError.InternalServerError(messageCenter.public.internalServerErrorMsg); }
      return sendResponseToClient(res, messageCenter.public.success, httpStatusCodes.OK, null, messageCenter.public.successUpdate);
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
      if (!category) { throw createHttpError.InternalServerError(messageCenter.public.REMOVEFAILED); }
      return sendResponseToClient(res, messageCenter.public.success, httpStatusCodes.OK, null, messageCenter.public.removeSuccessfull);
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
    const category = await CategoryModel.findOne({ _id: categoryId });
    return !!category.subCategory.length;
  }
}

module.exports = new CategoryManager();
