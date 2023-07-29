const createHttpError = require('http-errors');
const { BlogModel } = require('../../../model/blog');
const BaseController = require('../baseController');
const unlinkFile = require('../../../utilities/unlinkFile');
const { filterObj } = require('../../../utilities/functions');

class BlogManager extends BaseController {
  async createBlog(req, res, next) {
    try {
      const {
        title, summary, body, image, tag, category,
      } = req.body;
      const createdBlog = await BlogModel.create(
        {
          title, summary, body, author: req.user.id, image, tag, category,
        },
      );
      res.status(201).json({
        message: 'پست با موفقیت ایجاد شد',
        data: createdBlog,
      });
    } catch (error) {
      await unlinkFile(req.body.uploadedFilePath);
      next(error);
    }
  }

  async getBlogsLists(req, res, next) {
    try {
      const blogs = await BlogModel.aggregate([
        {
          $match: {},
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
          $lookup: {
            from: 'users',
            foreignField: '_id',
            localField: 'author',
            as: 'author',
          },
        },
        {
          $unwind: '$category',
        },
        {
          $unwind: '$author',
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
            'author._id': 0,
            'author.roles': 0,
            'author.otp': 0,
            'author.profileImage': 0,
            'author.createdAt': 0,
            'author.updatedAt': 0,
            'author.__v': 0,
          },
        },
      ]);
      return res.status(200).json({
        status: 'success',
        data: blogs,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateBlog(req, res, next) {
    try {
      const { id } = req.body;
      await this.checkBlogExist(id);
      const allowedFiledsForUpdate = ['title', 'summary', 'body', 'image', 'tag', 'category'];
      const filteredBody = filterObj(req.body, allowedFiledsForUpdate);
      const updatedResult = await BlogModel.updateOne(
        { _id: id },
        {
          $set: filteredBody
        },
        {
          runValidators: true,
        },
      );
      if (updatedResult.modifiedCount !== 1) { throw createHttpError.InternalServerError('خطای داخلی سرور'); }
      return res.status(200).json({
        message: 'بروزرسانی باموفقیت انجام شد',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteBlog(req, res, next) {
    try {
      const { id: _id } = req.body;
      await this.checkBlogExist(_id);
      const deleteResult = await BlogModel.deleteOne({ _id });
      if (deleteResult.deletedCount !== 1) { throw createHttpError.InternalServerError('خطای داخلی سرور'); }
      return res.status(204);
    } catch (error) {
      next(error);
    }
  }

  async checkBlogExist(id, title) {
    const blog = await BlogModel.findOne({
      $or: [
        {
          _id: id,
        },
        { title },
      ],
    });
    if (!blog) throw createHttpError.NotFound('پست مورد نظر یافت نشد');
    return {
      exist: !!blog,
      data: blog,
    };
  }
}

module.exports = new BlogManager();
