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

const BlogsDisLikesResolver = {
    type: ResponseType,
    args: { BlogID: { type: GraphQLString } },
    resolve: async (__, args, context) => {
        const { req } = context;
        const user = await isAuthenticatedForGraphQL(req);
        const { BlogID } = args;
        await checkExistContent(BlogModel, BlogID);
        let message;
        let disLikeActionQuery;
        const isDisLikedByUser = await BlogModel.findOne({
            disLikes: [user.id]
        });
        if (isDisLikedByUser) {
            disLikeActionQuery = { $pull: { disLikes: user.id } };
            message = messageCenter.DIS_LIKES.UNSET_LIKE;
        } else {
            disLikeActionQuery = { $push: { disLikes: user.id } };
            message = messageCenter.DIS_LIKES.SET_LIKE;
        }
        await BlogModel.updateOne({ _id: BlogID }, disLikeActionQuery);
        return {
            status: messageCenter.public.success,
            message
        };
    }
};
const ProductDisLikesResolver = {
    type: ResponseType,
    args: { ProductID: { type: GraphQLString } },
    resolve: async (__, args, context) => {
        const { req } = context;
        const user = await isAuthenticatedForGraphQL(req);
        const { ProductID } = args;
        await checkExistContent(ProductModel, ProductID);
        let message;
        let disLikeActionQuery;
        const isDisLikedByUser = await ProductModel.findOne({
            disLikes: [user.id]
        });
        if (isDisLikedByUser) {
            disLikeActionQuery = { $pull: { disLikes: user.id } };
            message = messageCenter.DIS_LIKES.UNSET_LIKE;
        } else {
            disLikeActionQuery = { $push: { disLikes: user.id } };
            message = messageCenter.DIS_LIKES.SET_LIKE;
        }
        await ProductModel.updateOne({ _id: ProductID }, disLikeActionQuery);
        return {
            status: messageCenter.public.success,
            message
        };
    }
};
const CoursesDisLikesResolver = {
    type: ResponseType,
    args: { CourseID: { type: GraphQLString } },
    resolve: async (__, args, context) => {
        const { req } = context;
        const user = await isAuthenticatedForGraphQL(req);
        const { CourseID } = args;
        await checkExistContent(CourseModel, CourseID);
        let message;
        let disLikeActionQuery;
        const isDisLikedByUser = await CourseModel.findOne({
            disLikes: [user.id]
        });
        if (isDisLikedByUser) {
            disLikeActionQuery = { $pull: { disLikes: user.id } };
            message = messageCenter.DIS_LIKES.UNSET_LIKE;
        } else {
            disLikeActionQuery = { $push: { disLikes: user.id } };
            message = messageCenter.DIS_LIKES.SET_LIKE;
        }
        await CourseModel.updateOne({ _id: CourseID }, disLikeActionQuery);
        return {
            status: messageCenter.public.success,
            message
        };
    }
};

module.exports = {
    BlogsDisLikesResolver,
    ProductDisLikesResolver,
    CoursesDisLikesResolver
};
