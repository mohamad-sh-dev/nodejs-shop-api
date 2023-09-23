const createHttpError = require('http-errors');
const { StatusCodes: httpStatusCodes } = require('http-status-codes');
const { BlogModel } = require('../../../../model/blog');
const BaseController = require('../../baseController');
const unlinkFile = require('../../../../utilities/unlinkFile');
const { filterObj, sendResponseToClient } = require('../../../../utilities/functions');
const { messageCenter } = require('../../../../utilities/messages');
const { publicDefinitions } = require('../../../../utilities/publicDefinitions');

class BlogManager extends BaseController {
  async createBlog(req, res, next) {
    try {
      const {
        title, summary, body, tag, category,
      } = req.body;
      if (Object.keys(req.file).length > 1) {
        req.body.image = req.file.uploadedPath;
      }
      const createdBlog = await BlogModel.create(
        {
          title,
          summary,
          body,
          tag,
          category,
          author: req.user.id,
          image: req.body.image,
        },
      );
      return sendResponseToClient(res, messageCenter.public.success, httpStatusCodes.CREATED, createdBlog, messageCenter.BLOGS.CREATED);
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
      return sendResponseToClient(res, messageCenter.public.success, httpStatusCodes.OK, blogs);
    } catch (error) {
      next(error);
    }
  }

  async updateBlog(req, res, next) {
    try {
      const { id } = req.body;
      await this.checkBlogExist(id);
      const filteredBody = filterObj(req.body, publicDefinitions.blogsAllowedFieldsToBeUpdated());
      const updatedResult = await BlogModel.updateOne(
        { _id: id },
        {
          $set: filteredBody
        },
        {
          runValidators: true,
        },
      );
      if (!updatedResult.modifiedCount) throw createHttpError.InternalServerError(messageCenter.public.internalServerErrorMsg);
      return sendResponseToClient(res, messageCenter.public.successUpdate, httpStatusCodes.OK);
    } catch (error) {
      next(error);
    }
  }

  async deleteBlog(req, res, next) {
    try {
      const { id: _id } = req.body;
      await this.checkBlogExist(_id);
      const deleteResult = await BlogModel.deleteOne({ _id });
      if (!deleteResult.deletedCount) { throw createHttpError.InternalServerError(messageCenter.public.REMOVEFAILED); }
      return sendResponseToClient(res, messageCenter.public.removeSuccessfull, httpStatusCodes.OK);
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
    if (!blog) throw createHttpError.NotFound(messageCenter.public.notFoundContent);
    return {
      exist: !!blog,
      data: blog,
    };
  }
}

module.exports = new BlogManager();
