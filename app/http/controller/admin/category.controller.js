const { CategoryModel } = require("../../../model/categories");
const createHttpError = require("http-errors");
const BaseController = require("../baseController");

class CategoryManager extends BaseController {
  // Create category
  async createCategory(req, res, next) {
    try {
      const { name, parentCategory, subCategory } = req.body;
      const existCategory = await this.checkCategoryExist(name);
      if (existCategory.exist)
        throw createHttpError.BadRequest("دسته بندی مورد نظر وجود دارد");
      await CategoryModel.create({name, parentCategory, subCategory});
      res.status(201).json({
        message: "دسته بندی با موفقیت ایجاد شد",
      });
    } catch (error) {
      next(error);
    }
  }

  // Read category
  async getCategory(req, res, next) {
    try {
      const { categoryId, name } = req.query;
      const category = await CategoryModel.findOne({
        $or: [{ _id: categoryId }, { name }]
      });
      if (!category)
        throw createHttpError.NotFound("دسته بندی مورد نظر موجود نمیباشد");
      return res.status(200).json({
        status: "success",
        data: category
      });
    } catch (error) {
      next(error);
    }
  }

  // Update category
  async updateCategory(req, res, next) {
    try {
      const { categoryId, name, parentCategory, subCategories } = req.body;
      const category = (await this.checkCategoryExist(name, categoryId)).data;
      if(!category) throw createHttpError.NotFound('دسته بندی مورد نظر موجود نیست'); 
      const updatedCategory = await CategoryModel.updateOne({_id : category.id} , {
        name , parentCategory, subCategories
      },
      {
        runValidators : true
      })
      if(updatedCategory.modifiedCount !== 1) throw createHttpError.InternalServerError('خطای داخلی سرور') ;
      return res.status(200).json({
        message :'اپدیت باموفقیت انجام شد' 
      })
    } catch (error) {
      next(error);
    }
  }

  // Delete category
  async deleteCategory(categoryId, callback) {
    try {
      const {categoryId} = req.params
      const category = await CategoryModel.findByIdAndRemove(categoryId)
      if(!category) throw createHttpError.InternalServerError('خطای داخلی سرور') ;
      return res.status(200).json({
        status : 'success' ,
        data : category
      }) 
    } catch (error) {
      next(error) ;
    }
  }

  async checkCategoryExist(name, id) {
    try {
      const category = await CategoryModel.findOne({
        $or: [
          {
            _id: id
          },
          {name}
        ],
      });
      return {
        exist: !!category,
        data: category,
      };
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CategoryManager() ;
