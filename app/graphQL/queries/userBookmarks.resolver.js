/* eslint-disable no-return-await */
/* eslint-disable import/no-extraneous-dependencies */
const { GraphQLList } = require('graphql');
const { BlogsType } = require('../typeDefs/blogs.type');
const { BlogModel } = require('../../model/blog');
const { isAuthenticatedForGraphQL } = require('../../http/middlewares/authorization');
const { ProductModel } = require('../../model/product');
const { CourseModel } = require('../../model/courses');
const { CoursesType } = require('../typeDefs/courses.type');
const { ProductsType } = require('../typeDefs/products.types');

const GetUserBookmarkedBlogs = {
    type: new GraphQLList(BlogsType),
    resolve: async (_, __, context) => {
        const { req } = context;
        const user = await isAuthenticatedForGraphQL(req);
        return await BlogModel.find({
            bookmarks: user.id
        })
            .populate('category likes disLikes bookmarks')
            .populate({
                path: 'comments',
                populate: {
                    path: 'user answer'
                }
            })
            .populate({
                path: 'comments.answer.user'
            });
    }
};
const GetUserBookmarkedProducts = {
    type: new GraphQLList(ProductsType),
    resolve: async (_, __, context) => {
        const { req } = context;
        const user = await isAuthenticatedForGraphQL(req);
        return await ProductModel.find({
            bookmarks: user.id
        })
            .populate('category likes disLikes')
            .populate({
                path: 'comments',
                populate: {
                    path: 'user answer'
                }
            })
            .populate({
                path: 'comments.answer.user'
            });
    }
};
const GetUserBookmarkedCourses = {
    type: new GraphQLList(CoursesType),
    resolve: async (_, __, context) => {
        const { req } = context;
        const user = await isAuthenticatedForGraphQL(req);
        const bookmarkedCoursesList = await CourseModel.find({
            bookmarks: user.id
        })
            .populate('category likes disLikes')
            .populate({
                path: 'comments',
                populate: {
                    path: 'user answer'
                }
            })
            .populate({
                path: 'comments.answer.user'
            });

        return bookmarkedCoursesList;
    }
};

module.exports = {
    GetUserBookmarkedBlogs,
    GetUserBookmarkedProducts,
    GetUserBookmarkedCourses
};
