/* eslint-disable no-return-await */
/* eslint-disable import/no-extraneous-dependencies */
const { GraphQLString } = require('graphql');
const { ResponseType } = require('../typeDefs/publicTypes');
const { isAuthenticatedForGraphQL } = require('../../http/middlewares/authorization');
const { checkExistContent } = require('../utils');
const { messageCenter } = require('../../utilities/messages');
const { ProductModel } = require('../../model/product');
const { CourseModel } = require('../../model/courses');
const { BlogModel } = require('../../model/blog');

const BlogsBookmarksResolver = {
    type: ResponseType,
    args: { BlogID: { type: GraphQLString } },
    resolve: async (__, args, context) => {
        const { req } = context;
        const user = await isAuthenticatedForGraphQL(req);
        const { BlogID } = args;
        await checkExistContent(BlogModel, BlogID);
        let message;
        let bookmarkActionQuery;
        const isBookmarkedAlready = await BlogModel.findOne({
            _id: BlogID,
            bookmarks: [user.id]
        });
        if (isBookmarkedAlready) {
            bookmarkActionQuery = { $pull: { bookmarks: user.id } };
            message = messageCenter.BOOKMARKS.UNSET_BOOKMARK;
        } else {
            bookmarkActionQuery = { $push: { bookmarks: user.id } };
            message = messageCenter.BOOKMARKS.SET_BOOKMARK;
        }
        await BlogModel.updateOne({ _id: BlogID }, bookmarkActionQuery);
        return {
            status: messageCenter.public.success,
            message
        };
    }
};
const ProductBookmarksResolver = {
    type: ResponseType,
    args: { ProductID: { type: GraphQLString } },
    resolve: async (__, args, context) => {
        const { req } = context;
        const user = await isAuthenticatedForGraphQL(req);
        const { ProductID } = args;
        await checkExistContent(ProductModel, ProductID);
        let message;
        let bookmarkActionQuery;
        const isBookmarkedAlready = await ProductModel.findOne({
            _id: ProductID,
            bookmarks: [user.id]
        });
        if (isBookmarkedAlready) {
            bookmarkActionQuery = { $pull: { bookmarks: user.id } };
            message = messageCenter.BOOKMARKS.UNSET_BOOKMARK;
        } else {
            bookmarkActionQuery = { $push: { bookmarks: user.id } };
            message = messageCenter.BOOKMARKS.SET_BOOKMARK;
        }
        await ProductModel.updateOne({ _id: ProductID }, bookmarkActionQuery);
        return {
            status: messageCenter.public.success,
            message
        };
    }
};
const CoursesBookmarksResolver = {
    type: ResponseType,
    args: { CourseID: { type: GraphQLString } },
    resolve: async (__, args, context) => {
        const { req } = context;
        const user = await isAuthenticatedForGraphQL(req);
        const { CourseID } = args;
        await checkExistContent(CourseModel, CourseID);
        let message;
        let bookmarkActionQuery;
        const isBookmarkedAlready = await CourseModel.findOne({
            _id: CourseID,
            bookmarks: [user.id]
        });
        if (isBookmarkedAlready) {
            bookmarkActionQuery = { $pull: { bookmarks: user.id } };
            message = messageCenter.BOOKMARKS.UNSET_BOOKMARK;
        } else {
            bookmarkActionQuery = { $push: { bookmarks: user.id } };
            message = messageCenter.BOOKMARKS.SET_BOOKMARK;
        }
        await CourseModel.updateOne({ _id: CourseID }, bookmarkActionQuery);
        return {
            status: messageCenter.public.success,
            message
        };
    }
};
module.exports = {
    BlogsBookmarksResolver,
    ProductBookmarksResolver,
    CoursesBookmarksResolver
};
