/* eslint-disable no-return-await */
/* eslint-disable import/no-extraneous-dependencies */
const { GraphQLString } = require('graphql');
const { BlogModel } = require('../../model/blog');
const { ResponseType } = require('../typeDefs/publicTypes');
const { isAuthenticatedForGraphQL } = require('../../http/middlewares/authorization');
const { checkExistContent } = require('../utils');
const { messageCenter } = require('../../utilities/messages');
const { ProductModel } = require('../../model/product');
const { CourseModel } = require('../../model/courses');

const BlogsLikesResolver = {
    type: ResponseType,
    args: { BlogID: { type: GraphQLString } },
    resolve: async (__, args, context) => {
        const { req } = context;
        const user = await isAuthenticatedForGraphQL(req);
        const { BlogID } = args;
        await checkExistContent(BlogModel, BlogID);
        let message;
        let likeActionQuery;
        const isLikedByUser = await BlogModel.findOne({
            likes: [user.id]
        });
        if (isLikedByUser) {
            likeActionQuery = { $pull: { likes: user.id } };
            message = messageCenter.LIKES.UNSET_LIKE;
        } else {
            likeActionQuery = { $push: { likes: user.id } };
            message = messageCenter.LIKES.SET_LIKE;
        }
        await BlogModel.updateOne({ _id: BlogID }, likeActionQuery);
        return {
            status: messageCenter.public.success,
            message
        };
    }
};
const ProductLikesResolver = {
    type: ResponseType,
    args: { ProductID: { type: GraphQLString } },
    resolve: async (__, args, context) => {
        const { req } = context;
        const user = await isAuthenticatedForGraphQL(req);
        const { ProductID } = args;
        await checkExistContent(ProductModel, ProductID);
        let message;
        let likeActionQuery;
        const isLikedByUser = await ProductModel.findOne({
            likes: [user.id]
        });
        if (isLikedByUser) {
            likeActionQuery = { $pull: { likes: user.id } };
            message = messageCenter.LIKES.UNSET_LIKE;
        } else {
            likeActionQuery = { $push: { likes: user.id } };
            message = messageCenter.LIKES.SET_LIKE;
        }
        await ProductModel.updateOne({ _id: ProductID }, likeActionQuery);
        return {
            status: messageCenter.public.success,
            message
        };
    }
};
const CoursesLikesResolver = {
    type: ResponseType,
    args: { CourseID: { type: GraphQLString } },
    resolve: async (__, args, context) => {
        const { req } = context;
        const user = await isAuthenticatedForGraphQL(req);
        const { CourseID } = args;
        await checkExistContent(CourseModel, CourseID);
        let message;
        let likeActionQuery;
        const isLikedByUser = await CourseModel.findOne({
            likes: [user.id]
        });
        if (isLikedByUser) {
            likeActionQuery = { $pull: { likes: user.id } };
            message = messageCenter.LIKES.UNSET_LIKE;
        } else {
            likeActionQuery = { $push: { likes: user.id } };
            message = messageCenter.LIKES.SET_LIKE;
        }
        await CourseModel.updateOne({ _id: CourseID }, likeActionQuery);
        return {
            status: messageCenter.public.success,
            message
        };
    }
};

module.exports = {
    BlogsLikesResolver,
    CoursesLikesResolver,
    ProductLikesResolver
};
