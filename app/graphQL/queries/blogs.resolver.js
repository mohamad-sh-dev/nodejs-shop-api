/* eslint-disable no-return-await */
/* eslint-disable import/no-extraneous-dependencies */
const { GraphQLList, GraphQLString } = require('graphql');
const { BlogsType } = require('../typeDefs/blogs.type');
const { BlogModel } = require('../../model/blog');

const BlogResolver = {
    type: new GraphQLList(BlogsType),
    args: { category: { type: GraphQLString } },
    resolve: async (__, args) => {
        const { category } = args;
        const dbQuery = category ? { category } : {};
        return await BlogModel.find(dbQuery)
            .populate('author category likes disLikes')
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

module.exports = {
    BlogResolver
};
