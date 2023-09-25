/* eslint-disable no-return-await */
/* eslint-disable import/no-extraneous-dependencies */
const { GraphQLList } = require('graphql');
const { BlogsType } = require('../typeDefs/blogs.type');
const { BlogModel } = require('../../model/blog');

const BlogResolver = {
    type: new GraphQLList(BlogsType),
    resolve: async () => await BlogModel.find().populate('author category')

};

module.exports = {
    BlogResolver
};
