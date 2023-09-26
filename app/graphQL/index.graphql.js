/* eslint-disable import/no-extraneous-dependencies */
const {
    GraphQLObjectType, GraphQLSchema,
} = require('graphql');
const { BlogResolver } = require('./queries/blogs.resolver');
const { ProductsResolver } = require('./queries/products.resolver');
const { CategoryResolver, SubCategoryResolver } = require('./queries/category.resolver');
const { CourseResolver } = require('./queries/courses.resolver');
const { CreateCommentsForBlogs } = require('./queries/comments.resolver');

const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        blogs: BlogResolver,
        products: ProductsResolver,
        category: CategoryResolver,
        subCategory: SubCategoryResolver,
        courses: CourseResolver
    }
});
const RootMutations = new GraphQLObjectType({
    name: 'RootMutaions',
    fields: {
        createCommentsForBlogs: CreateCommentsForBlogs
    }
});

const graphQLSchema = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutations
});

module.exports = {
    graphQLSchema
};
