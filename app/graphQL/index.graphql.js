/* eslint-disable import/no-extraneous-dependencies */
const {
    GraphQLObjectType, GraphQLSchema,
} = require('graphql');
const { BlogResolver } = require('./queries/blogs.resolver');
const { ProductsResolver } = require('./queries/products.resolver');
const { CategoryResolver, SubCategoryResolver } = require('./queries/category.resolver');
const { CourseResolver } = require('./queries/courses.resolver');
const { CreateCommentsForBlogs, CreateCommentsForCourses, CreateCommentsForProducts } = require('./mutations/comments.resolver');
const { BlogsLikesResolver } = require('./mutations/likes.resolver');

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
        CreateCommentsForBlogs,
        CreateCommentsForProducts,
        CreateCommentsForCourses,
        BlogsLikesResolver
    }
});

const graphQLSchema = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutations
});

module.exports = {
    graphQLSchema
};
